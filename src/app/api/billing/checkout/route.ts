import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan, PLAN_ORDER } from "@/lib/plans";
import { getStripe, getStripePriceId } from "@/lib/stripe";
import { getRequestLocale } from "@/lib/request-locale";
import type { SiteLocale } from "@/lib/landing-content";

// Shown above Checkout's pay button, next to Stripe's optional "purchasing as
// a business" tax ID field (MENUO sells B2B: the VAT number makes the
// invoice a reverse-charge one, see the webhook).
const TAX_ID_HINT: Record<SiteLocale, string> = {
  en: "Buying for your business? Add your VAT number to get the invoice issued to your company.",
  it: "Acquisti per la tua attività? Inserisci la Partita IVA per ricevere la fattura intestata alla tua attività.",
  pt: "Compra para a sua empresa? Indique o NIF para receber a fatura em nome da empresa.",
  es: "¿Compras para tu negocio? Añade tu NIF/CIF para recibir la factura a nombre de tu empresa.",
  fr: "Vous achetez pour votre entreprise ? Indiquez votre numéro de TVA pour recevoir la facture à son nom.",
  de: "Kaufen Sie für Ihr Unternehmen? Geben Sie Ihre USt-IdNr. an, um die Rechnung auf Ihre Firma zu erhalten.",
};

// Only ever offered once per customer: gated below on the account not
// already having a Stripe customer, so canceling and resubscribing doesn't
// grant a fresh trial every time.
const TRIAL_PERIOD_DAYS = 14;

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
  const locale = await getRequestLocale();
  const isFirstTimeCustomer = !existing?.stripeCustomerId;

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    customer: existing?.stripeCustomerId ?? undefined,
    customer_email: existing?.stripeCustomerId ? undefined : session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    adaptive_pricing: { enabled: true },
    // Dedicated confirmation page so Google Ads can count a conversion by URL.
    success_url: `${siteUrl}/dashboard/billing/confirmado`,
    cancel_url: `${siteUrl}/dashboard/billing?canceled=1`,
    client_reference_id: userId,
    metadata: { userId, plan: plan.key, interval },
    // Card is always collected, trial included (Stripe's default for
    // subscription mode, made explicit since the whole signup flow now
    // depends on it).
    payment_method_collection: "always",
    subscription_data: {
      metadata: { userId, plan: plan.key, interval },
      ...(isFirstTimeCustomer
        ? {
            trial_period_days: TRIAL_PERIOD_DAYS,
            // Safety net: if a trial somehow ends with no card on file,
            // cancel instead of leaving an unpaid subscription around.
            trial_settings: { end_behavior: { missing_payment_method: "cancel" as const } },
          }
        : {}),
    },
  };
  const taxParams: Partial<Stripe.Checkout.SessionCreateParams> = {
    // Optional company VAT number (Stripe shows a "purchasing as a business"
    // checkbox). Stays optional on purpose, to keep the signup funnel light.
    tax_id_collection: { enabled: true },
    // Required by Stripe alongside tax_id_collection for an existing customer:
    // the name/address typed at checkout is saved onto them.
    ...(existing?.stripeCustomerId ? { customer_update: { name: "auto" as const, address: "auto" as const } } : {}),
    custom_text: { submit: { message: TAX_ID_HINT[locale] } },
  };

  let checkoutSession: Stripe.Checkout.Session;
  try {
    checkoutSession = await stripe.checkout.sessions.create({ ...params, ...taxParams });
  } catch (err) {
    // Never let the optional VAT field block a signup: if Stripe rejects it,
    // open the same checkout without it.
    if (!(err instanceof Stripe.errors.StripeInvalidRequestError)) throw err;
    console.error("[checkout] tax ID collection rejected, retrying without it:", err.message);
    checkoutSession = await stripe.checkout.sessions.create(params);
  }

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ devMode: false, url: checkoutSession.url });
}
