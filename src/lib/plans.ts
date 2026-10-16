export type PlanKey = "essential" | "business" | "hospitality" | "multi-location";
export type BillingInterval = "monthly" | "annual";

export type Plan = {
  key: PlanKey;
  name: string;
  priceCents: number; // monthly price, in cents
  isFromPrice?: boolean; // shows "From €X" instead of "€X" (multi-location scales with locations)
  maxEstablishments: number;
  maxMenusPerEstablishment: number;
  tagline: string;
  features: string[];
};

export const PLANS: Record<PlanKey, Plan> = {
  essential: {
    key: "essential",
    name: "Essential",
    priceCents: 990,
    maxEstablishments: 1,
    maxMenusPerEstablishment: 1,
    tagline: "1 menu · 1 establishment",
    features: [
      "1 digital menu",
      "1 establishment",
      "20 languages, QR code, PDF export",
    ],
  },
  business: {
    key: "business",
    name: "Business",
    priceCents: 1990,
    maxEstablishments: 1,
    maxMenusPerEstablishment: 3,
    tagline: "Up to 3 menus · 1 establishment",
    features: [
      "Up to 3 digital menus",
      "1 establishment",
      "20 languages, QR code, PDF export",
    ],
  },
  hospitality: {
    key: "hospitality",
    name: "Hospitality",
    priceCents: 3490,
    maxEstablishments: 1,
    maxMenusPerEstablishment: 10,
    tagline: "Up to 10 menus · 1 establishment",
    features: [
      "Up to 10 digital menus",
      "1 establishment",
      "20 languages, QR code, PDF export",
    ],
  },
  "multi-location": {
    key: "multi-location",
    name: "Multi-location",
    priceCents: 6990,
    isFromPrice: true,
    maxEstablishments: 5,
    maxMenusPerEstablishment: 5,
    tagline: "Up to 5 establishments · up to 5 menus each",
    features: [
      "Up to 5 establishments",
      "Up to 5 menus per establishment",
      "20 languages, QR code, PDF export",
    ],
  },
};

export const PLAN_ORDER: PlanKey[] = ["essential", "business", "hospitality", "multi-location"];

export function getPlan(key: string): Plan | null {
  return (PLANS as Record<string, Plan>)[key] ?? null;
}

/** Annual billing charges 10x the monthly price — 2 months free. */
export function priceCentsFor(plan: Plan, interval: BillingInterval): number {
  return interval === "annual" ? plan.priceCents * 10 : plan.priceCents;
}

function formatAmount(cents: number): string {
  const amount = cents / 100;
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

export type PriceLabels = {
  /** BCP 47 locale used to format the amount (e.g. "pt-PT"). Omit for "€9.90". */
  locale?: string;
  from: string;
  perMonth: string;
  perYear: string;
};

const DEFAULT_PRICE_LABELS: PriceLabels = { from: "From", perMonth: "/mo", perYear: "/yr" };

export function formatPlanPrice(
  plan: Plan,
  interval: BillingInterval,
  labels: PriceLabels = DEFAULT_PRICE_LABELS
): string {
  const cents = priceCentsFor(plan, interval);
  const prefix = plan.isFromPrice ? `${labels.from} ` : "";
  const suffix = interval === "annual" ? labels.perYear : labels.perMonth;
  const amount = labels.locale
    ? new Intl.NumberFormat(labels.locale, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
      }).format(cents / 100)
    : `€${formatAmount(cents)}`;
  return `${prefix}${amount}${suffix}`;
}

/** Ceiling applied to accounts with no active paid subscription: they can
 * still build a single menu for a single establishment, they just can't
 * publish it (see requireActiveSubscription in session.ts). */
export const UNSUBSCRIBED_LIMITS = {
  maxEstablishments: 1,
  maxMenusPerEstablishment: 1,
};
