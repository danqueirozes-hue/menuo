import type { LandingDict } from "../landing-content";
import { PRICING_SHARED } from "./pricing-shared";

/** Master copy: every other locale translates these keys. */
export const en: LandingDict = {
  nav: { demo: "Demo", how: "How it works", pricing: "Pricing", faq: "FAQ", login: "Log in" },
  cta: "Start your 14-day free trial",
  hero: {
    eyebrow: "For restaurants that welcome the world",
    titlePlain: "One menu.",
    titleHighlight: "Every language.",
    subtitle:
      "Upload a photo or PDF of your menu: in minutes it becomes a digital menu in 20 languages, with allergens fully covered. Foreign guests scan one QR code and read everything in their own language, no app needed.",
    cta2: "Try the live demo",
    trust: ["14 days free", "No app for guests", "Cancel anytime"],
    imageAlt: "Guest at a table scanning the menu QR code with a phone",
  },
  demo: {
    title: "See your menu through a tourist's eyes",
    text: "Scan the QR code or tap the button to open a sample trattoria menu, exactly as your guests would see it.",
    bullets: ["Switch language in one tap", "Filter gluten-free, shellfish-free or vegan dishes"],
    namesBullet: "See how dish names stay in the original language",
    button: "Open the sample menu",
    scan: "Scan with your phone",
  },
  benefits: {
    title: "A menu your guests understand is a menu they spend more on",
    items: [
      {
        title: "Higher average ticket",
        description: "Guests who understand the dishes order with confidence: starters, signature dishes, wine.",
      },
      {
        title: "Allergens always compliant",
        description:
          "All 14 allergens required by EU Regulation 1169/2011 are flagged and translated into every language. Guests filter the dishes that suit them.",
      },
      {
        title: "Your staff works better",
        description: "No more explaining every dish in improvised English. Orders move faster and tables turn sooner.",
      },
      {
        title: "Fewer mistakes, better reviews",
        description: "Guests who know what they ordered get no surprises, and say so on Google and TripAdvisor.",
      },
    ],
  },
  how: {
    title: "From paper menu to a 20-language menu in three steps",
    steps: [
      { title: "Upload a photo or PDF", description: "AI recognises sections, dishes and prices." },
      {
        title: "Review and publish",
        description: "Edit anything, add photos and download a print-ready QR code for tables, windows or receipts.",
      },
      { title: "Guests choose their language", description: "They scan the QR, pick one of 20 languages and read the menu." },
    ],
    note: "Prices and daily specials update with one edit, in every language.",
  },
  names: {
    title: "Your dish names stay yours",
    text: "Carbonara stays carbonara. MENUO keeps the original name and translates the description, so foreign guests understand what they order without losing authenticity. Every translation can be edited.",
    original: "Cacio e pepe",
    translations: [
      { lang: "DE", text: "Tonnarelli mit Pecorino Romano und schwarzem Pfeffer" },
      { lang: "FR", text: "Tonnarelli au pecorino romano et poivre noir" },
      { lang: "ES", text: "Tonnarelli con pecorino romano y pimienta negra" },
    ],
  },
  languagesSection: { title: "20 languages, one menu", note: "More coming soon." },
  social: { title: "Already used by restaurants like yours" },
  pricing: {
    ...PRICING_SHARED.en,
    title: "Pick the plan that fits your restaurant",
    subtitle: "Every plan includes 20 languages, QR codes, PDF export, all 14 EU allergens and AI import from photo or PDF.",
    planDesc: {
      essential: "E.g. your main menu",
      business: "E.g. lunch, dinner and wine list",
      hospitality: "E.g. restaurant, bar, breakfast and room service",
      "multi-location": "For groups with several venues",
    },
    anchor: "Less than a coffee a week",
    fiscal: "Prices exclude VAT · Invoice issued to your company",
    noCommitment: "No commitment: cancel anytime",
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Do I need a card for the trial?",
        a: "Yes, we ask for it when you start, but nothing is charged for 14 days. Cancel before the trial ends and you pay nothing.",
      },
      {
        q: "Do I get an invoice?",
        a: "Yes. Add your company's VAT number when you subscribe and you receive an invoice in your company's name every month or year.",
      },
      {
        q: "Are the translations accurate? Can I edit them?",
        a: "Translations are generated automatically and you can edit every text, in every language. Original dish names stay unchanged.",
      },
      { q: "Do my guests need an app?", a: "No. They scan the QR code with their camera and the menu opens in the browser." },
      {
        q: "How do allergens work?",
        a: "You flag the 14 EU allergens for each dish and MENUO shows them translated in every language. Guests can filter the dishes that suit them. The restaurant remains responsible for the information.",
      },
      {
        q: "If I change a price, do I reprint the QR?",
        a: "No. The QR code always stays the same, and your changes go online in every language.",
      },
      { q: "What counts as a “menu”?", a: "Each separate list: for example lunch, dinner, wine list or desserts." },
      {
        q: "Can I cancel anytime?",
        a: "Yes, no commitment. Cancel from your account at any time and your plan stays active until the end of the paid period.",
      },
    ],
  },
  final: {
    title: "Give every guest your full menu, in their language",
    human: "Rather talk to a person? We reply on WhatsApp.",
    humanEmail: "Rather talk to a person? Write to us:",
    whatsapp: "Message us on WhatsApp",
  },
  footer: { tagline: "One menu. Every language.", cookies: "Cookies" },
};
