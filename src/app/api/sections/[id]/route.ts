import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

const schema = z.object({
  name: z.string().min(1).max(60).optional(),
  position: z.number().int().min(0).optional(),
});

async function assertOwnership(sectionId: string, userId: string) {
  const section = await prisma.menuSection.findUnique({
    where: { id: sectionId },
    include: { menu: { include: { restaurant: true } } },
  });
  return section && section.menu.restaurant.ownerId === userId ? section : null;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await assertOwnership(id, userId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const section = await prisma.menuSection.update({ where: { id }, data: parsed.data });
  return NextResponse.json(section);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await assertOwnership(id, userId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.menuSection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
