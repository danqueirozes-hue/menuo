import type { Metadata } from "next";
import { SITE_LOCALES, localeHref, type SiteLocale } from "./landing-content";

/** Search/ads copy per landing locale (title + meta description, also used for
 * the Open Graph preview WhatsApp shows when a link is shared). */
const SEO: Record<SiteLocale, { title: string; description: string; ogAlt: string; ogLocale: string }> = {
  en: {
    title: "Multilingual QR code digital menu for restaurants · MENUO",
    description:
      "Turn your menu into a digital menu in 20 languages with one QR code. EU allergens included, no app. Try it free for 14 days.",
    ogAlt: "Guest at a table scanning the menu QR code with a phone",
    ogLocale: "en_GB",
  },
  it: {
    title: "Menu digitale multilingue con QR code per ristoranti · MENUO",
    description:
      "Trasforma il tuo menu in un menu digitale in 20 lingue con un solo QR code. Allergeni UE inclusi, senza app. Prova gratis 14 giorni.",
    ogAlt: "Cliente al tavolo che inquadra il QR code del menu con lo smartphone",
    ogLocale: "it_IT",
  },
  pt: {
    title: "Menu digital multilingue com QR code para restaurantes · MENUO",
    description:
      "Transforme o seu menu num menu digital em 20 idiomas com um só QR code. Alergénios da UE incluídos, sem app. Experimente grátis durante 14 dias.",
    ogAlt: "Cliente à mesa a ler o QR code do menu com o telemóvel",
    ogLocale: "pt_PT",
  },
  es: {
    title: "Carta digital multilingüe con código QR para restaurantes · MENUO",
    description:
      "Convierte tu carta en una carta digital en 20 idiomas con un solo código QR. Alérgenos de la UE incluidos, sin app. Pruébalo gratis 14 días.",
    ogAlt: "Cliente en la mesa escaneando el código QR de la carta con el móvil",
    ogLocale: "es_ES",
  },
  fr: {
    title: "Menu digital multilingue avec QR code pour restaurants · MENUO",
    description:
      "Transformez votre carte en menu digital en 20 langues avec un seul QR code. Allergènes UE inclus, sans application. Essai gratuit de 14 jours.",
    ogAlt: "Client à table scannant le QR code du menu avec son téléphone",
    ogLocale: "fr_FR",
  },
  de: {
    title: "Mehrsprachige digitale Speisekarte mit QR-Code für Restaurants · MENUO",
    description:
      "Machen Sie Ihre Speisekarte zur digitalen Karte in 20 Sprachen – mit einem einzigen QR-Code. EU-Allergene inklusive, ohne App. 14 Tage kostenlos testen.",
    ogAlt: "Gast am Tisch scannt den QR-Code der Speisekarte mit dem Handy",
    ogLocale: "de_DE",
  },
};

/** Title, description, canonical, hreflang (+ x-default → English) and Open
 * Graph for one landing locale. */
export function landingMetadata(locale: SiteLocale): Metadata {
  const seo = SEO[locale];
  const languages: Record<string, string> = Object.fromEntries(
    SITE_LOCALES.map((l) => [l, localeHref(l)]),
  );
  languages["x-default"] = "/";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://menuoglobal.com"),
    title: seo.title,
    description: seo.description,
    alternates: { canonical: localeHref(locale), languages },
    openGraph: {
      type: "website",
      siteName: "MENUO",
      url: localeHref(locale),
      title: seo.title,
      description: seo.description,
      locale: seo.ogLocale,
      images: [{ url: "/images/landing/hero-scan.jpg", width: 1536, height: 1024, alt: seo.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

/** Translated alt text for the landing images (hero + table gallery). */
export const LANDING_IMAGE_ALTS: Record<SiteLocale, { hero: string; tables: [string, string] }> = {
  en: {
    hero: SEO.en.ogAlt,
    tables: ["MENUO table stand with QR code at a rooftop restaurant overlooking the Eiffel Tower", "MENUO table stand with QR code at a seaside restaurant"],
  },
  it: {
    hero: SEO.it.ogAlt,
    tables: ["Segnaposto MENUO con QR code su una terrazza con vista sulla Torre Eiffel", "Segnaposto MENUO con QR code in un ristorante sul mare"],
  },
  pt: {
    hero: SEO.pt.ogAlt,
    tables: ["Suporte de mesa MENUO com QR code num terraço com vista para a Torre Eiffel", "Suporte de mesa MENUO com QR code num restaurante à beira-mar"],
  },
  es: {
    hero: SEO.es.ogAlt,
    tables: ["Soporte de mesa MENUO con código QR en una terraza con vistas a la Torre Eiffel", "Soporte de mesa MENUO con código QR en un restaurante junto al mar"],
  },
  fr: {
    hero: SEO.fr.ogAlt,
    tables: ["Chevalet de table MENUO avec QR code sur un rooftop face à la tour Eiffel", "Chevalet de table MENUO avec QR code dans un restaurant en bord de mer"],
  },
  de: {
    hero: SEO.de.ogAlt,
    tables: ["MENUO-Tischaufsteller mit QR-Code auf einer Dachterrasse mit Blick auf den Eiffelturm", "MENUO-Tischaufsteller mit QR-Code in einem Restaurant am Meer"],
  },
};
