import { prisma } from "@/lib/prisma";
import { LANGUAGES } from "@/lib/languages";
import { translateText } from "@/lib/translate";
import { mapWithConcurrency } from "@/lib/concurrency";

type MenuWithContent = {
  defaultLanguage: string;
  sections: {
    id: string;
    name: string;
    items: { id: string; name: string; description: string | null }[];
  }[];
};

const TRANSLATE_CONCURRENCY = 5;
// Keep every batch small enough that a single request always finishes well
// inside Netlify's edge timeout (~26-30s), no matter how big the menu is —
// a large menu just takes more batches, not a slower request. Combined with
// the tight retry budget in translate.ts, worst case per batch stays a few
// seconds even when the translation provider is rate-limiting.
export const TRANSLATE_BATCH_SIZE = 10;

function targetLanguagesFor(menu: MenuWithContent): string[] {
  return LANGUAGES.map((l) => l.code).filter((code) => code !== menu.defaultLanguage);
}

/** Total (entity x language) pairs a fully-translated menu should have. */
function totalPairCount(menu: MenuWithContent): number {
  const langCount = targetLanguagesFor(menu).length;
  const itemCount = menu.sections.reduce((sum, s) => sum + s.items.length, 0);
  return (menu.sections.length + itemCount) * langCount;
}

export async function countPendingTranslations(menu: MenuWithContent): Promise<number> {
  const sectionIds = menu.sections.map((s) => s.id);
  const itemIds = menu.sections.flatMap((s) => s.items.map((i) => i.id));

  const [doneSections, doneItems] = await Promise.all([
    sectionIds.length
      ? prisma.sectionTranslation.count({ where: { sectionId: { in: sectionIds } } })
      : 0,
    itemIds.length
      ? prisma.itemTranslation.count({ where: { menuItemId: { in: itemIds } } })
      : 0,
  ]);

  return Math.max(0, totalPairCount(menu) - doneSections - doneItems);
}

type Task =
  | { kind: "section"; sectionId: string; text: string; lang: string }
  | { kind: "item"; itemId: string; name: string; description: string; lang: string };

/** Finds up to `limit` not-yet-translated (entity, language) pairs, in a
 * stable order, so repeated calls make steady forward progress through the
 * whole menu without ever redoing work. */
async function findPendingBatch(menu: MenuWithContent, limit: number): Promise<Task[]> {
  const targetLanguages = targetLanguagesFor(menu);
  const tasks: Task[] = [];

  for (const section of menu.sections) {
    if (tasks.length >= limit) break;
    const existing = new Set(
      (
        await prisma.sectionTranslation.findMany({
          where: { sectionId: section.id },
          select: { language: true },
        })
      ).map((t) => t.language)
    );
    for (const lang of targetLanguages) {
      if (tasks.length >= limit) break;
      if (!existing.has(lang)) tasks.push({ kind: "section", sectionId: section.id, text: section.name, lang });
    }

    for (const item of section.items) {
      if (tasks.length >= limit) break;
      const existingItem = new Set(
        (
          await prisma.itemTranslation.findMany({
            where: { menuItemId: item.id },
            select: { language: true },
          })
        ).map((t) => t.language)
      );
      for (const lang of targetLanguages) {
        if (tasks.length >= limit) break;
        if (!existingItem.has(lang)) {
          tasks.push({
            kind: "item",
            itemId: item.id,
            name: item.name,
            description: item.description ?? "",
            lang,
          });
        }
      }
    }
  }

  return tasks;
}

/** Translates one bounded batch of pending work for a menu. Safe to call
 * repeatedly until `remaining` hits 0 — already-translated pairs are
 * skipped, so re-running a batch (e.g. after a retry) never redoes work. */
export async function runTranslationBatch(
  menu: MenuWithContent
): Promise<{ remaining: number; translatedInBatch: number }> {
  const tasks = await findPendingBatch(menu, TRANSLATE_BATCH_SIZE);

  await mapWithConcurrency(tasks, TRANSLATE_CONCURRENCY, async (task) => {
    if (task.kind === "section") {
      const result = await translateText(task.text, task.lang);
      if (!result.translated) return;
      await prisma.sectionTranslation.upsert({
        where: { sectionId_language: { sectionId: task.sectionId, language: task.lang } },
        create: { sectionId: task.sectionId, language: task.lang, name: result.text },
        update: { name: result.text },
      });
    } else {
      const [name, description] = await Promise.all([
        translateText(task.name, task.lang),
        translateText(task.description, task.lang),
      ]);
      if (!name.translated) return;
      await prisma.itemTranslation.upsert({
        where: { menuItemId_language: { menuItemId: task.itemId, language: task.lang } },
        create: {
          menuItemId: task.itemId,
          language: task.lang,
          name: name.text,
          description: description.text,
        },
        update: { name: name.text, description: description.text },
      });
    }
  });

  const remaining = await countPendingTranslations(menu);
  return { remaining, translatedInBatch: tasks.length };
}
