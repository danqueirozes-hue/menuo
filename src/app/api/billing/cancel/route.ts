import { NextResponse } from "next/server";
import { getCurrentUserId, getSubscription } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await getSubscription(userId);
  if (!subscription) return NextResponse.json({ error: "No subscription found" }, { status: 404 });

  const stripe = getStripe();
  if (!stripe || !subscription.stripeSubscriptionId) {
    // No real Stripe subscription to respect a period for (dev-mode
    // bypass) — just deactivate immediately, same as before.
    const updated = await prisma.subscription.update({
      where: { userId },
      data: { status: "canceled" },
    });
    return NextResponse.json({ status: updated.status, currentPeriodEnd: null });
  }

  // Cancel at period end, not immediately: the customer already paid for
  // (or is trialing through) the current period, so access stays on until
  // it actually ends instead of cutting off mid-cycle. Status is left
  // alone — Stripe only flips it to "canceled" once the period end
  // arrives, which the webhook then picks up.
  const stripeSub = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });
  // Stripe's newer API versions moved current_period_end off the
  // subscription object onto each subscription item (to support items on
  // different billing cycles) — we only ever have one item per subscription.
  const rawPeriodEnd = stripeSub.items.data[0]?.current_period_end;
  const periodEnd = rawPeriodEnd ? new Date(rawPeriodEnd * 1000) : subscription.currentPeriodEnd;

  const updated = await prisma.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: true, currentPeriodEnd: periodEnd ?? undefined },
  });

  return NextResponse.json({ status: updated.status, currentPeriodEnd: updated.currentPeriodEnd });
}
