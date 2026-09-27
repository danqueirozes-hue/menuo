import { NextResponse } from "next/server";
import { getCurrentUserId, getSubscription } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

/** Undoes a pending cancel_at_period_end — the customer changed their mind
 * before their current period actually ran out. */
export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await getSubscription(userId);
  if (!subscription || !subscription.cancelAtPeriodEnd) {
    return NextResponse.json({ error: "No pending cancellation to undo" }, { status: 400 });
  }

  const stripe = getStripe();
  if (stripe && subscription.stripeSubscriptionId) {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
  }

  const updated = await prisma.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: false },
  });

  return NextResponse.json({ status: updated.status });
}
