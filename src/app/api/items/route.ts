import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

const schema = z.object({
  sectionId: z.string(),
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(""),
  price: z.number().min(0).max(10000),
  photoUrl: z.string().optional(),
  isVegetarian: z.boolean().optional().default(false),
  isVegan: z.boolean().optional().default(false),
  isGlutenFree: z.boolean().optional().default(false),
  hasSeafood: z.boolean().optional().default(false),
  isSpecialty: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
  }
  const {
    sectionId,
    name,
    description,
    price,
    photoUrl,
    isVegetarian,
    isVegan,
    isGlutenFree,
    hasSeafood,
    isSpecialty,
    isNew,
  } = parsed.data;

  const section = await prisma.menuSection.findUnique({
    where: { id: sectionId },
    include: { menu: { include: { restaurant: true } } },
  });
  if (!section || section.menu.restaurant.ownerId !== userId) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const count = await prisma.menuItem.count({ where: { sectionId } });

  const item = await prisma.menuItem.create({
    data: {
      sectionId,
      name,
      description,
      priceCents: Math.round(price * 100),
      photoUrl,
      position: count,
      isVegetarian,
      isVegan,
      isGlutenFree,
      hasSeafood,
      isSpecialty,
      isNew,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
