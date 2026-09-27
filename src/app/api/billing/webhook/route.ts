import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { isSubscriptionActive } from "@/lib/session";

// As of Stripe's newer "flexible billing" API versions, a subscription's
// current_period_end no longer lives on the subscription object itself —
// each subscription ITEM has its own billing period now (to support
// multiple items on different cycles). We only ever create single-item
// subscriptions, so the first item's period is the subscription's period.
function getPeriodEnd(sub: Stripe.Subscription): number | undefined {
  return sub.items.data[0]?.current_period_end;
}

/** Takes every currently-published menu for this account offline — used
 * when a subscription lapses (trial ended with no payment collected, a
 * renewal charge failed, or the plan was fully canceled). Guests scanning
 * an already-printed QR code should stop seeing a menu the restaurant isn't
 * paying for, the same way a fresh publish is already blocked in that
 * state. Doesn't touch translations or publishedAt, so re-publishing once
 * they're paying again is instant. */
async function unpublishAllMenusForUser(userId: string) {
  const { count } = await prisma.menu.updateMany({
    where: { restaurant: { ownerId: userId }, isPublished: true },
    data: { isPublished: false },
  });
  if (count > 0) {
    console.log(`[stripe webhook] unpublished ${count} menu(s) for user ${userId} — subscription is no longer active`);
  }
}

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
        // Don't assume "active" — a checkout with a trial comes back as a
        // real Stripe subscription in "trialing" status, not "active", and
        // hardcoding it here would make a not-yet-billed trial look like
        // paid revenue everywhere the status is read (admin MRR included).
        const stripeSubscriptionId = (checkoutSession.subscription as string) ?? undefined;
        let status = "active";
        let currentPeriodEnd: Date | undefined;
        if (stripeSubscriptionId) {
          const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          status = stripeSub.status;
          const periodEnd = getPeriodEnd(stripeSub);
          if (periodEnd) currentPeriodEnd = new Date(periodEnd * 1000);
        }

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan,
            interval,
            status,
            stripeCustomerId: (checkoutSession.customer as string) ?? undefined,
            stripeSubscriptionId,
            cancelAtPeriodEnd: false,
            currentPeriodEnd,
          },
          update: {
            plan,
            interval,
            status,
            stripeCustomerId: (checkoutSession.customer as string) ?? undefined,
            stripeSubscriptionId,
            cancelAtPeriodEnd: false,
            currentPeriodEnd,
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
        const periodEnd = getPeriodEnd(stripeSub);
        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            status: stripeSub.status,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end ?? false,
          },
        });

        // Covers every way a subscription stops being active: the trial
        // ended and the first charge failed (-> past_due), retries were
        // exhausted (-> unpaid), or it was fully canceled (-> canceled /
        // this same event as "deleted"). Doesn't fire for the routine
        // trialing -> active transition, or while cancel_at_period_end is
        // pending but the period hasn't ended yet — Stripe only reports the
        // subscription's own status as no-longer-active once that period
        // genuinely ends.
        if (!isSubscriptionActive({ status: stripeSub.status })) {
          await unpublishAllMenusForUser(existing.userId);
        }
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
