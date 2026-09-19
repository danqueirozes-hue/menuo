import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, getSubscription, getEffectiveLimits, getUserRestaurants } from "@/lib/session";

const schema = z.object({ name: z.string().min(1).max(80) });

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid establishment name" }, { status: 400 });

  const [subscription, restaurants] = await Promise.all([
    getSubscription(userId),
    getUserRestaurants(userId),
  ]);
  const limits = getEffectiveLimits(subscription);

  if (restaurants.length >= limits.maxEstablishments) {
    return NextResponse.json(
      {
        error:
          limits.maxEstablishments === 1
            ? "Your plan supports a single establishment. Upgrade to Multi-location to add more."
            : `Your plan supports up to ${limits.maxEstablishments} establishments.`,
      },
      { status: 403 }
    );
  }

  const restaurant = await prisma.restaurant.create({
    data: { name: parsed.data.name, ownerId: userId },
    include: { menus: true },
  });

  return NextResponse.json(restaurant, { status: 201 });
}
