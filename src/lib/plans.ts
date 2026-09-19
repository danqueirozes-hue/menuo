export type PlanKey = "essential" | "business" | "hospitality" | "multi-location";

export type Plan = {
  key: PlanKey;
  name: string;
  priceCents: number;
  priceLabel: string; // how the price is displayed ("€29/mo", "From €99/mo")
  maxEstablishments: number;
  maxMenusPerEstablishment: number;
  tagline: string;
  features: string[];
};

export const PLANS: Record<PlanKey, Plan> = {
  essential: {
    key: "essential",
    name: "Essential",
    priceCents: 2900,
    priceLabel: "€29/mo",
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
    priceCents: 3900,
    priceLabel: "€39/mo",
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
    priceCents: 4900,
    priceLabel: "€49/mo",
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
    priceCents: 9900,
    priceLabel: "From €99/mo",
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

/** Ceiling applied to accounts with no active paid subscription: they can
 * still build a single menu for a single establishment, they just can't
 * publish it (see requireActiveSubscription in session.ts). */
export const UNSUBSCRIBED_LIMITS = {
  maxEstablishments: 1,
  maxMenusPerEstablishment: 1,
};
