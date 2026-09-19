import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, requireMenuIdOwnership } from "@/lib/session";

const schema = z.object({ menuId: z.string(), name: z.string().min(1).max(60) });

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid section name" }, { status: 400 });
  }
  const { menuId, name } = parsed.data;

  const owned = await requireMenuIdOwnership(menuId, userId);
  if (!owned) return NextResponse.json({ error: "Menu not found" }, { status: 404 });

  const count = await prisma.menuSection.count({ where: { menuId } });

  const section = await prisma.menuSection.create({
    data: { menuId, name, position: count },
    include: { items: true },
  });

  return NextResponse.json(section, { status: 201 });
}
