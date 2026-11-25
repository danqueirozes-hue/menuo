import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, requireMenuIdOwnership } from "@/lib/session";
import { isValidLanguage } from "@/lib/languages";

const text = z.string().max(2000);
const schema = z.object({
  language: z.string(),
  sections: z.array(z.object({ id: z.string(), name: text })).max(200),
  items: z.array(z.object({ id: z.string(), name: text, description: text })).max(2000),
});

/** Saves the owner's corrections for one language. An emptied field removes
 * that translation, so the next publish translates it again automatically. */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await requireMenuIdOwnership(id, userId))) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { language, sections, items } = parsed.data;

  const menu = await prisma.menu.findUnique({
    where: { id },
    select: { defaultLanguage: true, sections: { select: { id: true, items: { select: { id: true } } } } },
  });
  if (!menu || !isValidLanguage(language) || language === menu.defaultLanguage) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }
  // Only rows that really belong to this menu.
  const sectionIds = new Set(menu.sections.map((s) => s.id));
  const itemIds = new Set(menu.sections.flatMap((s) => s.items.map((i) => i.id)));

  await prisma.$transaction([
    ...sections
      .filter((s) => sectionIds.has(s.id))
      .map((s) =>
        s.name.trim()
          ? prisma.sectionTranslation.upsert({
              where: { sectionId_language: { sectionId: s.id, language } },
              create: { sectionId: s.id, language, name: s.name.trim() },
              update: { name: s.name.trim() },
            })
          : prisma.sectionTranslation.deleteMany({ where: { sectionId: s.id, language } }),
      ),
    ...items
      .filter((i) => itemIds.has(i.id))
      .map((i) =>
        i.name.trim()
          ? prisma.itemTranslation.upsert({
              where: { menuItemId_language: { menuItemId: i.id, language } },
              create: { menuItemId: i.id, language, name: i.name.trim(), description: i.description.trim() || null },
              update: { name: i.name.trim(), description: i.description.trim() || null },
            })
          : prisma.itemTranslation.deleteMany({ where: { menuItemId: i.id, language } }),
      ),
  ]);

  return NextResponse.json({ ok: true });
}
