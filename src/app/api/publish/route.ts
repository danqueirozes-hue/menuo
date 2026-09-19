import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCurrentUserId,
  getSubscription,
  isSubscriptionActive,
  requireOwnedMenu,
} from "@/lib/session";
import { LANGUAGES } from "@/lib/languages";
import { translateText } from "@/lib/translate";

// Publishing can need ~150+ translation calls (dishes x languages) for a
// small menu. Running them one at a time was taking well over a minute,
// long enough to look "stuck" or hit a proxy/function timeout. A small
// concurrency pool cuts that dramatically while fetchWithRetry (see
// src/lib/translate.ts) still backs off on 429s from any single worker.
const TRANSLATE_CONCURRENCY = 5;

async function mapWithConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>
): Promise<void> {
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const item = items[next++];
      await fn(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const menuId = body?.menuId as string | undefined;
  const publish = body?.publish !== false;

  if (!menuId) return NextResponse.json({ error: "Missing menuId" }, { status: 400 });

  const menu = await requireOwnedMenu(menuId, userId);
  if (!menu) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!publish) {
    const updated = await prisma.menu.update({ where: { id: menuId }, data: { isPublished: false } });
    return NextResponse.json({ isPublished: updated.isPublished });
  }

  const subscription = await getSubscription(userId);
  if (!isSubscriptionActive(subscription)) {
    return NextResponse.json(
      { error: "Subscribe to a plan to publish your menu.", code: "SUBSCRIPTION_REQUIRED" },
      { status: 402 }
    );
  }

  if (menu.sections.length === 0 || menu.sections.every((s) => s.items.length === 0)) {
    return NextResponse.json(
      { error: "Add at least one dish before publishing." },
      { status: 400 }
    );
  }

  const targetLanguages = LANGUAGES.map((l) => l.code).filter(
    (code) => code !== menu.defaultLanguage
  );

  for (const section of menu.sections) {
    const existingSectionLangs = new Set(
      (await prisma.sectionTranslation.findMany({ where: { sectionId: section.id } })).map(
        (t) => t.language
      )
    );
    const pendingSectionLangs = targetLanguages.filter((lang) => !existingSectionLangs.has(lang));
    await mapWithConcurrency(pendingSectionLangs, TRANSLATE_CONCURRENCY, async (lang) => {
      const result = await translateText(section.name, lang);
      // Only cache real translations. If no provider is configured, skip
      // persisting so this language is retried once a provider is added,
      // instead of permanently caching the untranslated source text.
      if (!result.translated) return;
      await prisma.sectionTranslation.upsert({
        where: { sectionId_language: { sectionId: section.id, language: lang } },
        create: { sectionId: section.id, language: lang, name: result.text },
        update: { name: result.text },
      });
    });

    for (const item of section.items) {
      const existingItemLangs = new Set(
        (await prisma.itemTranslation.findMany({ where: { menuItemId: item.id } })).map(
          (t) => t.language
        )
      );
      const pendingItemLangs = targetLanguages.filter((lang) => !existingItemLangs.has(lang));
      await mapWithConcurrency(pendingItemLangs, TRANSLATE_CONCURRENCY, async (lang) => {
        const [name, description] = await Promise.all([
          translateText(item.name, lang),
          translateText(item.description ?? "", lang),
        ]);
        if (!name.translated) return;
        await prisma.itemTranslation.upsert({
          where: { menuItemId_language: { menuItemId: item.id, language: lang } },
          create: {
            menuItemId: item.id,
            language: lang,
            name: name.text,
            description: description.text,
          },
          update: { name: name.text, description: description.text },
        });
      });
    }
  }

  const updated = await prisma.menu.update({
    where: { id: menuId },
    data: { isPublished: true, publishedAt: new Date() },
  });

  return NextResponse.json({ isPublished: updated.isPublished, slug: updated.slug });
}
