import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan, UNSUBSCRIBED_LIMITS } from "@/lib/plans";

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({ where: { userId } });
}

export function isSubscriptionActive(
  subscription: { status: string } | null
): boolean {
  return subscription?.status === "active" || subscription?.status === "trialing";
}

/** Plan limits currently in force for this account — the real plan if
 * subscribed, otherwise the free ceiling (1 establishment, 1 menu, can
 * build but not publish). */
export function getEffectiveLimits(subscription: { plan: string; status: string } | null) {
  if (isSubscriptionActive(subscription)) {
    const plan = getPlan(subscription!.plan);
    if (plan) return { maxEstablishments: plan.maxEstablishments, maxMenusPerEstablishment: plan.maxMenusPerEstablishment };
  }
  return UNSUBSCRIBED_LIMITS;
}

export async function getUserRestaurants(userId: string) {
  return prisma.restaurant.findMany({
    where: { ownerId: userId },
    include: { menus: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
}

/** Ownership-checked restaurant lookup for dashboard/API routes. */
export async function requireOwnedRestaurant(restaurantId: string, userId: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { menus: { orderBy: { createdAt: "asc" } } },
  });
  return restaurant && restaurant.ownerId === userId ? restaurant : null;
}

/** Ownership-checked menu lookup (walks menu -> restaurant -> owner). */
export async function requireOwnedMenu(menuId: string, userId: string) {
  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
    include: {
      restaurant: true,
      sections: { orderBy: { position: "asc" }, include: { items: { orderBy: { position: "asc" } } } },
    },
  });
  return menu && menu.restaurant.ownerId === userId ? menu : null;
}

export async function requireMenuIdOwnership(menuId: string, userId: string): Promise<boolean> {
  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
    select: { restaurant: { select: { ownerId: true } } },
  });
  return !!menu && menu.restaurant.ownerId === userId;
}
