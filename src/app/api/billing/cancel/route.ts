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
  if (stripe && subscription.stripeSubscriptionId) {
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
  }

  const updated = await prisma.subscription.update({
    where: { userId },
    data: { status: "canceled" },
  });

  return NextResponse.json({ status: updated.status });
}
