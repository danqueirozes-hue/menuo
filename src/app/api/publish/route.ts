import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCurrentUserId,
  getSubscription,
  isSubscriptionActive,
  requireOwnedMenu,
} from "@/lib/session";
import { countPendingTranslations } from "@/lib/translation-progress";

// Publishing itself is instant — it just flips a flag once the menu has
// content and an active plan. Translating into 20 languages is separate,
// bounded, repeatable work handled by POST /api/publish/translate so a
// single request never has to carry the whole menu's translation load (see
// src/lib/translation-progress.ts for why that matters at scale).
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const menuId = body?.menuId as string | undefined;
  const publish = body?.publish !== false;

  if (!menuId) return NextResponse.json({ error: "Missing menuId" }, { status: 400 });

  const menu = await requireOwnedMenu(menuId, userId);
  if (!menu) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!publish) {
    const updated = await prisma.menu.update({ where: { id: menuId }, data: { isPublished: false } });
    return NextResponse.json({ isPublished: updated.isPublished });
  }

  const subscription = await getSubscription(userId);
  if (!isSubscriptionActive(subscription)) {
    return NextResponse.json(
      { error: "Subscribe to a plan to publish your menu.", code: "SUBSCRIPTION_REQUIRED" },
      { status: 402 }
    );
  }

  if (menu.sections.length === 0 || menu.sections.every((s) => s.items.length === 0)) {
    return NextResponse.json(
      { error: "Add at least one dish before publishing." },
      { status: 400 }
    );
  }

  const updated = await prisma.menu.update({
    where: { id: menuId },
    data: { isPublished: true, publishedAt: new Date() },
  });

  const pendingTranslations = await countPendingTranslations(menu);

  return NextResponse.json({
    isPublished: updated.isPublished,
    slug: updated.slug,
    pendingTranslations,
  });
}
