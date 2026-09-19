import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, requireMenuIdOwnership } from "@/lib/session";

const schema = z.object({
  name: z.string().min(1).max(60).optional(),
  defaultLanguage: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await requireMenuIdOwnership(id, userId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const menu = await prisma.menu.update({ where: { id }, data: parsed.data });
  return NextResponse.json(menu);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await requireMenuIdOwnership(id, userId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.menu.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
