import { NextResponse } from "next/server";
import { requireAdminUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const adminUserId = await requireAdminUserId();
  if (!adminUserId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { userId } = await params;
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
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
