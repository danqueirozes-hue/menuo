import type { PlanKey, PriceLabels } from "../plans";
import type { SiteLocale } from "../landing-content";

/** Pricing strings shared by the landing page and the in-app billing screen
 * (BillingPlans), so both always say the same thing. */
export type PricingShared = {
  monthly: string;
  annual: string;
  annualNote: string;
  trialNote: string;
  mostPopular: string;
  price: PriceLabels;
  plans: Record<PlanKey, { tagline: string; features: string[] }>;
};

export const PRICING_SHARED: Record<SiteLocale, PricingShared> = {
  en: {
    monthly: "Monthly",
    annual: "Annual",
    annualNote: "2 months free",
    trialNote: "14-day free trial",
    mostPopular: "Most popular",
    price: {
      from: "From",
      perMonth: "/mo",
      perYear: "/yr",
    },
    plans: {
      essential: {
        tagline: "1 menu · 1 establishment",
        features: [
          "1 digital menu",
          "1 establishment",
          "20 languages, QR code, PDF export",
          "All 14 EU allergens, in every language",
          "Menu import from a photo or PDF (AI)",
        ],
      },
      business: {
        tagline: "Up to 3 menus · 1 establishment",
        features: [
          "Up to 3 digital menus",
          "1 establishment",
          "20 languages, QR code, PDF export",
          "All 14 EU allergens, in every language",
          "Menu import from a photo or PDF (AI)",
        ],
      },
      hospitality: {
        tagline: "Up to 10 menus · 1 establishment",
        features: [
          "Up to 10 digital menus",
          "1 establishment",
          "20 languages, QR code, PDF export",
          "All 14 EU allergens, in every language",
          "Menu import from a photo or PDF (AI)",
        ],
      },
      "multi-location": {
        tagline: "Up to 5 establishments · up to 5 menus each",
        features: [
          "Up to 5 establishments",
          "Up to 5 menus per establishment",
          "20 languages, QR code, PDF export",
          "All 14 EU allergens, in every language",
          "Menu import from a photo or PDF (AI)",
        ],
      },
    },
  },
  es: {
    monthly: "Mensual",
    annual: "Anual",
    annualNote: "2 meses gratis",
    trialNote: "Prueba gratis de 14 días",
    mostPopular: "Más popular",
    price: {
      locale: "es-ES",
      from: "Desde",
      perMonth: "/mes",
      perYear: "/año",
    },
    plans: {
      essential: {
        tagline: "1 menú · 1 establecimiento",
        features: [
          "1 menú digital",
          "1 establecimiento",
          "20 idiomas, código QR, exportación en PDF",
          "Los 14 alérgenos de la UE, en todos los idiomas",
          "Importación de la carta desde foto o PDF (IA)",
        ],
      },
      business: {
        tagline: "Hasta 3 menús · 1 establecimiento",
        features: [
          "Hasta 3 menús digitales",
          "1 establecimiento",
          "20 idiomas, código QR, exportación en PDF",
          "Los 14 alérgenos de la UE, en todos los idiomas",
          "Importación de la carta desde foto o PDF (IA)",
        ],
      },
      hospitality: {
        tagline: "Hasta 10 menús · 1 establecimiento",
        features: [
          "Hasta 10 menús digitales",
          "1 establecimiento",
          "20 idiomas, código QR, exportación en PDF",
          "Los 14 alérgenos de la UE, en todos los idiomas",
          "Importación de la carta desde foto o PDF (IA)",
        ],
      },
      "multi-location": {
        tagline: "Hasta 5 establecimientos · hasta 5 menús cada uno",
        features: [
          "Hasta 5 establecimientos",
          "Hasta 5 menús por establecimiento",
          "20 idiomas, código QR, exportación en PDF",
          "Los 14 alérgenos de la UE, en todos los idiomas",
          "Importación de la carta desde foto o PDF (IA)",
        ],
      },
    },
  },
  pt: {
    monthly: "Mensal",
    annual: "Anual",
    annualNote: "2 meses grátis",
    trialNote: "Teste grátis de 14 dias",
    mostPopular: "Mais popular",
    price: {
      locale: "pt-PT",
      from: "A partir de",
      perMonth: "/mês",
      perYear: "/ano",
    },
    plans: {
      essential: {
        tagline: "1 menu · 1 estabelecimento",
        features: [
          "1 menu digital",
          "1 estabelecimento",
          "20 idiomas, código QR, exportação em PDF",
          "Os 14 alergénios da UE, em todos os idiomas",
          "Importação do menu por fotografia ou PDF (IA)",
        ],
      },
      business: {
        tagline: "Até 3 menus · 1 estabelecimento",
        features: [
          "Até 3 menus digitais",
          "1 estabelecimento",
          "20 idiomas, código QR, exportação em PDF",
          "Os 14 alergénios da UE, em todos os idiomas",
          "Importação do menu por fotografia ou PDF (IA)",
        ],
      },
      hospitality: {
        tagline: "Até 10 menus · 1 estabelecimento",
        features: [
          "Até 10 menus digitais",
          "1 estabelecimento",
          "20 idiomas, código QR, exportação em PDF",
          "Os 14 alergénios da UE, em todos os idiomas",
          "Importação do menu por fotografia ou PDF (IA)",
        ],
      },
      "multi-location": {
        tagline: "Até 5 estabelecimentos · até 5 menus cada",
        features: [
          "Até 5 estabelecimentos",
          "Até 5 menus por estabelecimento",
          "20 idiomas, código QR, exportação em PDF",
          "Os 14 alergénios da UE, em todos os idiomas",
          "Importação do menu por fotografia ou PDF (IA)",
        ],
      },
    },
  },
  it: {
    monthly: "Mensile",
    annual: "Annuale",
    annualNote: "2 mesi gratis",
    trialNote: "Prova gratuita di 14 giorni",
    mostPopular: "Il più scelto",
    price: {
      locale: "it-IT",
      from: "Da",
      perMonth: "/mese",
      perYear: "/anno",
    },
    plans: {
      essential: {
        tagline: "1 menu · 1 locale",
        features: [
          "1 menu digitale",
          "1 locale",
          "20 lingue, codice QR, esportazione PDF",
          "I 14 allergeni UE, in ogni lingua",
          "Importazione del menu da foto o PDF (IA)",
        ],
      },
      business: {
        tagline: "Fino a 3 menu · 1 locale",
        features: [
          "Fino a 3 menu digitali",
          "1 locale",
          "20 lingue, codice QR, esportazione PDF",
          "I 14 allergeni UE, in ogni lingua",
          "Importazione del menu da foto o PDF (IA)",
        ],
      },
      hospitality: {
        tagline: "Fino a 10 menu · 1 locale",
        features: [
          "Fino a 10 menu digitali",
          "1 locale",
          "20 lingue, codice QR, esportazione PDF",
          "I 14 allergeni UE, in ogni lingua",
          "Importazione del menu da foto o PDF (IA)",
        ],
      },
      "multi-location": {
        tagline: "Fino a 5 locali · fino a 5 menu ciascuno",
        features: [
          "Fino a 5 locali",
          "Fino a 5 menu per locale",
          "20 lingue, codice QR, esportazione PDF",
          "I 14 allergeni UE, in ogni lingua",
          "Importazione del menu da foto o PDF (IA)",
        ],
      },
    },
  },
  de: {
    monthly: "Monatlich",
    annual: "Jährlich",
    annualNote: "2 Monate gratis",
    trialNote: "14 Tage kostenlos testen",
    mostPopular: "Am beliebtesten",
    price: {
      locale: "de-DE",
      from: "Ab",
      perMonth: "/Monat",
      perYear: "/Jahr",
    },
    plans: {
      essential: {
        tagline: "1 Speisekarte · 1 Betrieb",
        features: [
          "1 digitale Speisekarte",
          "1 Betrieb",
          "20 Sprachen, QR-Code, PDF-Export",
          "Alle 14 EU-Allergene, in jeder Sprache",
          "Speisekarten-Import per Foto oder PDF (KI)",
        ],
      },
      business: {
        tagline: "Bis zu 3 Speisekarten · 1 Betrieb",
        features: [
          "Bis zu 3 digitale Speisekarten",
          "1 Betrieb",
          "20 Sprachen, QR-Code, PDF-Export",
          "Alle 14 EU-Allergene, in jeder Sprache",
          "Speisekarten-Import per Foto oder PDF (KI)",
        ],
      },
      hospitality: {
        tagline: "Bis zu 10 Speisekarten · 1 Betrieb",
        features: [
          "Bis zu 10 digitale Speisekarten",
          "1 Betrieb",
          "20 Sprachen, QR-Code, PDF-Export",
          "Alle 14 EU-Allergene, in jeder Sprache",
          "Speisekarten-Import per Foto oder PDF (KI)",
        ],
      },
      "multi-location": {
        tagline: "Bis zu 5 Betriebe · je bis zu 5 Speisekarten",
        features: [
          "Bis zu 5 Betriebe",
          "Bis zu 5 Speisekarten pro Betrieb",
          "20 Sprachen, QR-Code, PDF-Export",
          "Alle 14 EU-Allergene, in jeder Sprache",
          "Speisekarten-Import per Foto oder PDF (KI)",
        ],
      },
    },
  },
  fr: {
    monthly: "Mensuel",
    annual: "Annuel",
    annualNote: "2 mois offerts",
    trialNote: "Essai gratuit de 14 jours",
    mostPopular: "Le plus populaire",
    price: {
      locale: "fr-FR",
      from: "À partir de",
      perMonth: "/mois",
      perYear: "/an",
    },
    plans: {
      essential: {
        tagline: "1 menu · 1 établissement",
        features: [
          "1 menu numérique",
          "1 établissement",
          "20 langues, code QR, export PDF",
          "Les 14 allergènes UE, dans toutes les langues",
          "Import de la carte par photo ou PDF (IA)",
        ],
      },
      business: {
        tagline: "Jusqu'à 3 menus · 1 établissement",
        features: [
          "Jusqu'à 3 menus numériques",
          "1 établissement",
          "20 langues, code QR, export PDF",
          "Les 14 allergènes UE, dans toutes les langues",
          "Import de la carte par photo ou PDF (IA)",
        ],
      },
      hospitality: {
        tagline: "Jusqu'à 10 menus · 1 établissement",
        features: [
          "Jusqu'à 10 menus numériques",
          "1 établissement",
          "20 langues, code QR, export PDF",
          "Les 14 allergènes UE, dans toutes les langues",
          "Import de la carte par photo ou PDF (IA)",
        ],
      },
      "multi-location": {
        tagline: "Jusqu'à 5 établissements · jusqu'à 5 menus chacun",
        features: [
          "Jusqu'à 5 établissements",
          "Jusqu'à 5 menus par établissement",
          "20 langues, code QR, export PDF",
          "Les 14 allergènes UE, dans toutes les langues",
          "Import de la carte par photo ou PDF (IA)",
        ],
      },
    },
  },
};
