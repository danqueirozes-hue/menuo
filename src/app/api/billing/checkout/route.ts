import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan, PLAN_ORDER } from "@/lib/plans";
import { getStripe, getStripePriceId } from "@/lib/stripe";

const schema = z.object({
  plan: z.enum(PLAN_ORDER as [string, ...string[]]),
  interval: z.enum(["monthly", "annual"]).default("monthly"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  const plan = getPlan(parsed.data.plan);
  if (!plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  const { interval } = parsed.data;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const stripe = getStripe();
  const priceId = getStripePriceId(plan.key, interval);

  if (!stripe || !priceId) {
    // No payment processor configured yet: activate the subscription
    // directly so the rest of the product (publish gating, plan limits) can
    // be built and tested end-to-end. Clearly a dev-only bypass — swap in
    // real Stripe keys + price IDs to replace this with real billing.
    await prisma.subscription.upsert({
      where: { userId },
      create: { userId, plan: plan.key, interval, status: "active" },
      update: { plan: plan.key, interval, status: "active" },
    });
    return NextResponse.json({ devMode: true, url: `${siteUrl}/dashboard/billing?activated=1` });
  }

  const existing = await prisma.subscription.findUnique({ where: { userId } });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: existing?.stripeCustomerId ?? undefined,
    customer_email: existing?.stripeCustomerId ? undefined : session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard/billing?success=1`,
    cancel_url: `${siteUrl}/dashboard/billing?canceled=1`,
    client_reference_id: userId,
    metadata: { userId, plan: plan.key, interval },
    subscription_data: { metadata: { userId, plan: plan.key, interval } },
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ devMode: false, url: checkoutSession.url });
}
