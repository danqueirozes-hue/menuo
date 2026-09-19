import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, requireOwnedRestaurant } from "@/lib/session";

const schema = z.object({
  name: z.string().min(1).max(80).optional(),
  address: z.string().max(160).optional(),
  city: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  currency: z.string().length(3).optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  logoUrl: z.string().nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await requireOwnedRestaurant(id, userId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const restaurant = await prisma.restaurant.update({ where: { id }, data: parsed.data });
  return NextResponse.json(restaurant);
}
