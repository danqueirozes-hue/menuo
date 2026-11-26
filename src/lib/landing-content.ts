import type { PlanKey } from "./plans";
import type { PricingShared } from "./landing/pricing-shared";
import { en } from "./landing/en";
import { it } from "./landing/it";
import { pt } from "./landing/pt";
import { es } from "./landing/es";
import { fr } from "./landing/fr";
import { de } from "./landing/de";

export const SITE_LOCALES =["en", "es", "pt", "it", "de", "fr"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];

export const LOCALE_LABELS: Record<SiteLocale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  it: "Italiano",
  de: "Deutsch",
  fr: "Français",
};

export function isSiteLocale(value: string): value is SiteLocale {
  return (SITE_LOCALES as readonly string[]).includes(value);
}

/** Preference cookie holding the site language the visitor last viewed, so
 * signed-in screens (e.g. billing) can follow it. */
export const SITE_LOCALE_COOKIE = "site_locale";

/** Signup link carrying the landing language (and an optional plan). */
export function signupHref(locale: SiteLocale, extra = ""): string {
  return `/signup?lang=${locale}${extra ? `&${extra}` : ""}`;
}

export function localeHref(locale: SiteLocale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

type Item = { title: string; description: string };

/** Every landing locale has exactly these keys (one file per locale in
 * ./landing/). Same sections, same order, same components in every language:
 * only the words change. English is the master copy. */
export type LandingDict = {
  nav: { demo: string; how: string; pricing: string; faq: string; login: string };
  /** The one call-to-action label used everywhere (navbar, hero, plans, final). */
  cta: string;
  hero: {
    eyebrow: string;
    titlePlain: string;
    titleHighlight: string;
    subtitle: string;
    cta2: string;
    /** The three micro-guarantees under the buttons. */
    trust: string[];
    imageAlt: string;
  };
  demo: {
    title: string;
    text: string;
    bullets: string[];
    /** Shown only once dish names stay in the original language (see landing config). */
    namesBullet: string;
    button: string;
    scan: string;
  };
  benefits: { title: string; items: Item[] };
  how: { title: string; steps: Item[]; note: string };
  names: { title: string; text: string; original: string; translations: { lang: string; text: string }[] };
  languagesSection: { title: string; note: string };
  social: { title: string };
  pricing: PricingShared & {
    title: string;
    subtitle: string;
    planDesc: Record<PlanKey, string>;
    /** Price anchor under the Essential plan (checked per market). */
    anchor: string;
    fiscal: string;
    noCommitment: string;
    securePayment: string;
    noChargeTrial: string;
  };
  faq: { title: string; items: { q: string; a: string }[] };
  final: { title: string; human: string; humanEmail: string; whatsapp: string };
  footer: { tagline: string; cookies: string };
  /** Floating live-chat button (Crisp). */
  chat: { cta: string; label: string };
};

export const LANDING_CONTENT: Record<SiteLocale, LandingDict> = { en, it, pt, es, fr, de };
