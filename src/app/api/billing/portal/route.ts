import { NextResponse } from "next/server";
import { getCurrentUserId, getSubscription } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

/** Opens Stripe's hosted Customer Portal (invoices, card, billing details)
 * for the signed-in customer. Requires the portal to be activated in the
 * Stripe dashboard (Settings → Billing → Customer portal). */
export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await getSubscription(userId);
  const stripe = getStripe();
  if (!stripe || !subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${siteUrl}/dashboard/account`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("[billing portal] could not create session:", err);
    return NextResponse.json({ error: "Portal unavailable" }, { status: 502 });
  }
}
