import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify, withRandomSuffix } from "@/lib/slug";
import { isValidLanguage } from "@/lib/languages";
import {
  getCurrentUserId,
  getSubscription,
  getEffectiveLimits,
  requireOwnedRestaurant,
} from "@/lib/session";

const schema = z.object({
  restaurantId: z.string(),
  name: z.string().min(1).max(60),
  defaultLanguage: z.string().refine(isValidLanguage, "Unsupported language"),
});

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid menu data" }, { status: 400 });
  const { restaurantId, name, defaultLanguage } = parsed.data;

  const restaurant = await requireOwnedRestaurant(restaurantId, userId);
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const subscription = await getSubscription(userId);
  const limits = getEffectiveLimits(subscription);

  if (restaurant.menus.length >= limits.maxMenusPerEstablishment) {
    return NextResponse.json(
      {
        error:
          limits.maxMenusPerEstablishment === 1
            ? "Your plan supports a single menu for this establishment. Upgrade to add more."
            : `Your plan supports up to ${limits.maxMenusPerEstablishment} menus per establishment.`,
      },
      { status: 403 }
    );
  }

  let slug = slugify(`${restaurant.name}-${name}`);
  const slugTaken = await prisma.menu.findUnique({ where: { slug } });
  if (slugTaken || !slug) slug = withRandomSuffix(slug || "menu");

  const menu = await prisma.menu.create({
    data: { restaurantId, name, slug, defaultLanguage },
  });

  return NextResponse.json(menu, { status: 201 });
}
