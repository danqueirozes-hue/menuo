import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

const variantSchema = z.object({
  label: z.string().min(1).max(30),
  price: z.number().min(0).max(10000),
});

const schema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    description: z.string().max(500).optional(),
    price: z.number().min(0).max(10000).optional(),
    hasVariants: z.boolean().optional(),
    variants: z.array(variantSchema).max(3).optional(),
    photoUrl: z.string().nullable().optional(),
    position: z.number().int().min(0).optional(),
    isAvailable: z.boolean().optional(),
    isVegetarian: z.boolean().optional(),
    isVegan: z.boolean().optional(),
    isGlutenFree: z.boolean().optional(),
    hasSeafood: z.boolean().optional(),
    isSpecialty: z.boolean().optional(),
    isNew: z.boolean().optional(),
  })
  .refine((d) => !d.hasVariants || (d.variants && d.variants.length >= 2), {
    message: "Add at least 2 price variants.",
    path: ["variants"],
  });

async function assertOwnership(itemId: string, userId: string) {
  const item = await prisma.menuItem.findUnique({
    where: { id: itemId },
    include: { section: { include: { menu: { include: { restaurant: true } } } } },
  });
  return item && item.section.menu.restaurant.ownerId === userId ? item : null;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await assertOwnership(id, userId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { price, variants, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };

  if (rest.hasVariants && variants) {
    data.priceCents = Math.min(...variants.map((v) => Math.round(v.price * 100)));
  } else if (price !== undefined) {
    data.priceCents = Math.round(price * 100);
  }

  const contentChanged = data.name !== undefined || data.description !== undefined;

  const item = await prisma.$transaction(async (tx) => {
    if (contentChanged) {
      await tx.itemTranslation.deleteMany({ where: { menuItemId: id } });
    }
    // Variants have no stable identity across edits from the client, so a
    // save always replaces the full set — simpler than diffing, and it
    // naturally drops stale translations via the cascade delete.
    if (variants !== undefined) {
      await tx.menuItemVariant.deleteMany({ where: { menuItemId: id } });
    }
    return tx.menuItem.update({
      where: { id },
      data: {
        ...data,
        ...(variants !== undefined
          ? {
              variants: {
                create: variants.map((v, i) => ({
                  label: v.label,
                  priceCents: Math.round(v.price * 100),
                  position: i,
                })),
              },
            }
          : {}),
      },
      include: { variants: true },
    });
  });

  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await assertOwnership(id, userId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
