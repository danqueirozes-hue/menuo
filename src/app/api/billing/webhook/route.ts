import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const userId = checkoutSession.metadata?.userId ?? checkoutSession.client_reference_id;
      const plan = checkoutSession.metadata?.plan;
      const interval = checkoutSession.metadata?.interval === "annual" ? "annual" : "monthly";
      if (userId && plan) {
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan,
            interval,
            status: "active",
            stripeCustomerId: (checkoutSession.customer as string) ?? undefined,
            stripeSubscriptionId: (checkoutSession.subscription as string) ?? undefined,
          },
          update: {
            plan,
            interval,
            status: "active",
            stripeCustomerId: (checkoutSession.customer as string) ?? undefined,
            stripeSubscriptionId: (checkoutSession.subscription as string) ?? undefined,
          },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const stripeSub = event.data.object as Stripe.Subscription;
      const existing = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: stripeSub.id },
      });
      if (existing) {
        const periodEnd = (stripeSub as unknown as { current_period_end?: number }).current_period_end;
        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            status: stripeSub.status,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
          },
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
