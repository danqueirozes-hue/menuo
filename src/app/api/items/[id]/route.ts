import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  price: z.number().min(0).max(10000).optional(),
  photoUrl: z.string().nullable().optional(),
  position: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  hasSeafood: z.boolean().optional(),
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

  const { price, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (price !== undefined) data.priceCents = Math.round(price * 100);

  const contentChanged = data.name !== undefined || data.description !== undefined;

  const item = await prisma.$transaction(async (tx) => {
    if (contentChanged) {
      await tx.itemTranslation.deleteMany({ where: { menuItemId: id } });
    }
    return tx.menuItem.update({ where: { id }, data });
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
