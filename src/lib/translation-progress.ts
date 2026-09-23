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

// Even 5 concurrent calls turned out to sustain enough request volume to
// trip DeepL free-tier's rate limit under real usage (not just synthetic
// stress tests) — a 429 cascade that stalls progress far worse than the
// concurrency ever saved. Staying low and pacing every call (see
// TRANSLATE_PACING_MS below) trades peak speed for actually finishing.
const TRANSLATE_CONCURRENCY = 2;
// Minimum gap before every DeepL call, on top of concurrency — this bounds
// the steady-state request rate even if DeepL's real per-second limit is
// lower than concurrency alone would respect.
const TRANSLATE_PACING_MS = 200;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Confirmed in production: under sustained DeepL throttling, a batch of 20
// at this pacing/concurrency can take 23-26s — uncomfortably close to
// Netlify's ~26-30s edge timeout. Smaller batches cost nothing extra now
// that discovery is a bulk query (see findPendingBatch below), so trade a
// few more HTTP round trips for real safety margin.
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
 * whole menu without ever redoing work.
 *
 * This fetches every existing translation for the menu in two bulk queries
 * up front, instead of one query per section/item. The earlier per-item
 * version re-scanned already-translated dishes from the start on every
 * single batch call — harmless for a small menu, but it meant adding 15
 * dishes to an already-translated 15-dish menu made *every* batch call pay
 * for re-checking all 30, not just the 15 that actually needed work. This
 * version's cost depends only on the menu's total size (two queries), not
 * on how many batches it takes to drain the pending work.
 */
async function findPendingBatch(menu: MenuWithContent, limit: number): Promise<Task[]> {
  const targetLanguages = targetLanguagesFor(menu);
  const sectionIds = menu.sections.map((s) => s.id);
  const itemIds = menu.sections.flatMap((s) => s.items.map((i) => i.id));

  const [sectionTranslations, itemTranslations] = await Promise.all([
    sectionIds.length
      ? prisma.sectionTranslation.findMany({
          where: { sectionId: { in: sectionIds } },
          select: { sectionId: true, language: true },
        })
      : [],
    itemIds.length
      ? prisma.itemTranslation.findMany({
          where: { menuItemId: { in: itemIds } },
          select: { menuItemId: true, language: true },
        })
      : [],
  ]);

  const doneSectionLangs = new Map<string, Set<string>>();
  for (const t of sectionTranslations) {
    if (!doneSectionLangs.has(t.sectionId)) doneSectionLangs.set(t.sectionId, new Set());
    doneSectionLangs.get(t.sectionId)!.add(t.language);
  }
  const doneItemLangs = new Map<string, Set<string>>();
  for (const t of itemTranslations) {
    if (!doneItemLangs.has(t.menuItemId)) doneItemLangs.set(t.menuItemId, new Set());
    doneItemLangs.get(t.menuItemId)!.add(t.language);
  }

  const tasks: Task[] = [];

  outer: for (const section of menu.sections) {
    const done = doneSectionLangs.get(section.id) ?? new Set();
    for (const lang of targetLanguages) {
      if (tasks.length >= limit) break outer;
      if (!done.has(lang)) tasks.push({ kind: "section", sectionId: section.id, text: section.name, lang });
    }

    for (const item of section.items) {
      const doneI = doneItemLangs.get(item.id) ?? new Set();
      for (const lang of targetLanguages) {
        if (tasks.length >= limit) break outer;
        if (!doneI.has(lang)) {
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
    await sleep(TRANSLATE_PACING_MS);
    if (task.kind === "section") {
      const result = await translateText(task.text, task.lang);
      if (!result.translated) return;
      await prisma.sectionTranslation.upsert({
        where: { sectionId_language: { sectionId: task.sectionId, language: task.lang } },
        create: { sectionId: task.sectionId, language: task.lang, name: result.text },
        update: { name: result.text },
      });
    } else {
      // Sequential, not Promise.all — keeps actual simultaneous DeepL
      // requests equal to TRANSLATE_CONCURRENCY instead of silently
      // doubling it for every item task.
      const name = await translateText(task.name, task.lang);
      await sleep(TRANSLATE_PACING_MS);
      const description = await translateText(task.description, task.lang);
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
