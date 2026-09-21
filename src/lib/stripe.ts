import Stripe from "stripe";
import { PlanKey, BillingInterval } from "@/lib/plans";

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}

export function hasStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

const PRICE_ENV_VAR: Record<BillingInterval, Record<PlanKey, string>> = {
  monthly: {
    essential: "STRIPE_PRICE_ESSENTIAL",
    business: "STRIPE_PRICE_BUSINESS",
    hospitality: "STRIPE_PRICE_HOSPITALITY",
    "multi-location": "STRIPE_PRICE_MULTI_LOCATION",
  },
  annual: {
    essential: "STRIPE_PRICE_ESSENTIAL_ANNUAL",
    business: "STRIPE_PRICE_BUSINESS_ANNUAL",
    hospitality: "STRIPE_PRICE_HOSPITALITY_ANNUAL",
    "multi-location": "STRIPE_PRICE_MULTI_LOCATION_ANNUAL",
  },
};

export function getStripePriceId(plan: PlanKey, interval: BillingInterval): string | null {
  return process.env[PRICE_ENV_VAR[interval][plan]] || null;
}
