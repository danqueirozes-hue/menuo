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
    sectionId: z.string(),
    name: z.string().min(1).max(120),
    description: z.string().max(500).optional().default(""),
    price: z.number().min(0).max(10000).optional(),
    hasVariants: z.boolean().optional().default(false),
    variants: z.array(variantSchema).max(3).optional().default([]),
    photoUrl: z.string().optional(),
    isVegetarian: z.boolean().optional().default(false),
    isVegan: z.boolean().optional().default(false),
    isGlutenFree: z.boolean().optional().default(false),
    hasSeafood: z.boolean().optional().default(false),
    isSpecialty: z.boolean().optional().default(false),
    isNew: z.boolean().optional().default(false),
  })
  .refine((d) => (d.hasVariants ? d.variants.length >= 2 : d.price !== undefined), {
    message: "Provide a price, or at least 2 price variants.",
    path: ["variants"],
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
    hasVariants,
    variants,
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

  const priceCents = hasVariants
    ? Math.min(...variants.map((v) => Math.round(v.price * 100)))
    : Math.round((price ?? 0) * 100);

  const item = await prisma.menuItem.create({
    data: {
      sectionId,
      name,
      description,
      priceCents,
      photoUrl,
      position: count,
      isVegetarian,
      isVegan,
      isGlutenFree,
      hasSeafood,
      isSpecialty,
      isNew,
      hasVariants,
      variants: hasVariants
        ? { create: variants.map((v, i) => ({ label: v.label, priceCents: Math.round(v.price * 100), position: i })) }
        : undefined,
    },
    include: { variants: true },
  });

  return NextResponse.json(item, { status: 201 });
}
