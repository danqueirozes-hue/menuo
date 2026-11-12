import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { normalizeAllergens } from "@/lib/allergens";
import { MENU_IMPORT_STORE, MenuImportJob } from "@/lib/menu-import";

const schema = z.object({ sections: z.array(z.number().int().min(0)) });

const cents = (price: number) => Math.max(0, Math.min(1_000_000, Math.round(price * 100)));

/** Writes the reviewed draft into the menu: the sections the owner kept are
 * appended after the existing ones. Imported allergens stay unconfirmed so
 * every dish is checked in the editor before guests rely on it. */
export async function POST(req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { jobId } = await params;
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: MENU_IMPORT_STORE, consistency: "strong" });
  const job = (await store.get(`${jobId}/job`, { type: "json" })) as MenuImportJob | null;
  if (!job || job.userId !== userId || job.status !== "done" || !job.result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const menu = await prisma.menu.findUnique({
    where: { id: job.menuId },
    select: { restaurant: { select: { ownerId: true } } },
  });
  if (!menu || menu.restaurant.ownerId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const keep = new Set(parsed.data.sections);
  const sections = job.result.sections.filter((s, i) => keep.has(i) && s.items.length > 0);
  const start = await prisma.menuSection.count({ where: { menuId: job.menuId } });

  await prisma.$transaction(
    sections.map((section, s) =>
      prisma.menuSection.create({
        data: {
          menuId: job.menuId,
          name: section.name.trim().slice(0, 60) || "Menu",
          position: start + s,
          items: {
            create: section.items.map((item, i) => {
              // The editor allows 2–3 price options; a single "variant" is just a price.
              const variants = item.variants.slice(0, 3).filter((v) => v.label.trim());
              const hasVariants = variants.length >= 2;
              return {
                name: item.name.trim().slice(0, 120) || "—",
                description: item.description.trim().slice(0, 500),
                priceCents: hasVariants ? Math.min(...variants.map((v) => cents(v.price))) : cents(item.price),
                position: i,
                hasVariants,
                allergens: normalizeAllergens(item.allergens),
                allergensConfirmed: false,
                variants: hasVariants
                  ? {
                      create: variants.map((v, p) => ({
                        label: v.label.trim().slice(0, 30),
                        priceCents: cents(v.price),
                        position: p,
                      })),
                    }
                  : undefined,
              };
            }),
          },
        },
      })
    )
  );

  await store.setJSON(`${jobId}/job`, { ...job, status: "applied" });
  return NextResponse.json({ sections: sections.length });
}
