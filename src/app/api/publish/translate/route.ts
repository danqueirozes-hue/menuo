import { NextResponse } from "next/server";
import {
  getCurrentUserId,
  getSubscription,
  isSubscriptionActive,
  requireOwnedMenu,
} from "@/lib/session";
import { runTranslationBatch } from "@/lib/translation-progress";

// Called repeatedly by the dashboard after publishing until `remaining`
// hits 0. Each call only translates a small, bounded batch (see
// TRANSLATE_BATCH_SIZE in src/lib/translation-progress.ts) so this stays
// fast regardless of how large the menu is.
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const menuId = body?.menuId as string | undefined;
  if (!menuId) return NextResponse.json({ error: "Missing menuId" }, { status: 400 });

  const menu = await requireOwnedMenu(menuId, userId);
  if (!menu) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const subscription = await getSubscription(userId);
  if (!isSubscriptionActive(subscription)) {
    return NextResponse.json(
      { error: "Subscribe to a plan to publish your menu.", code: "SUBSCRIPTION_REQUIRED" },
      { status: 402 }
    );
  }

  const { remaining, translatedInBatch } = await runTranslationBatch(menu);
  return NextResponse.json({ remaining, translatedInBatch, done: remaining === 0 });
}
