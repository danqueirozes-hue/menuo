import type { LandingDict } from "../landing-content";
import { PRICING_SHARED } from "./pricing-shared";

export const fr: LandingDict = {
  nav: { demo: "Démo", how: "Comment ça marche", pricing: "Tarifs", faq: "FAQ", login: "Connexion" },
  cta: "Essai gratuit de 14 jours",
  hero: {
    eyebrow: "Pour les restaurants qui accueillent le monde",
    titlePlain: "Un menu.",
    titleHighlight: "Toutes les langues.",
    subtitle:
      "Importez une photo ou le PDF de votre carte : en quelques minutes, elle devient un menu digital en 20 langues, avec des allergènes conformes. Les clients étrangers scannent un QR code et lisent tout dans leur langue, sans télécharger d'application.",
    cta2: "Essayer la démo",
    trust: ["14 jours gratuits", "Aucune app pour les clients", "Résiliable à tout moment"],
    imageAlt: "Chevalet MENUO avec QR code sur une table de restaurant dans la campagne toscane",
  },
  demo: {
    title: "Découvrez votre menu avec les yeux d'un touriste",
    text: "Scannez le QR code ou touchez le bouton : le menu d'une trattoria d'exemple s'ouvre, exactement comme vos clients le verraient.",
    bullets: ["Changez de langue d'un seul geste", "Filtrez les plats sans gluten, sans crustacés ou végans"],
    namesBullet: "Voyez comment les noms des plats restent dans la langue d'origine",
    button: "Ouvrir le menu d'exemple",
    scan: "Scannez avec votre téléphone",
  },
  benefits: {
    title: "Un menu que vos clients comprennent est un menu sur lequel ils dépensent plus",
    items: [
      {
        title: "Ticket moyen plus élevé",
        description: "Quand on comprend ce qu'on commande, on ose davantage : entrées, plats signature, vin.",
      },
      {
        title: "Allergènes toujours conformes",
        description:
          "Les 14 allergènes exigés par le règlement (UE) 1169/2011 sont signalés et traduits dans chaque langue. Le client filtre lui-même les plats qui lui conviennent.",
      },
      {
        title: "Votre équipe travaille mieux",
        description:
          "Fini d'expliquer chaque plat dans un anglais improvisé. Les commandes vont plus vite et les tables tournent plus tôt.",
      },
      {
        title: "Moins d'erreurs, de meilleurs avis",
        description:
          "Quand on sait ce qu'on a commandé, on n'a pas de mauvaise surprise, et on le dit sur Google et TripAdvisor.",
      },
    ],
  },
  how: {
    title: "De la carte papier au menu en 20 langues, en trois étapes",
    steps: [
      {
        title: "Importez une photo ou un PDF",
        description: "L'intelligence artificielle reconnaît les rubriques, les plats et les prix.",
      },
      {
        title: "Vérifiez et publiez",
        description:
          "Corrigez ce que vous voulez, ajoutez des photos et téléchargez le QR code prêt à imprimer pour les tables, la vitrine ou les tickets.",
      },
      {
        title: "Le client choisit sa langue",
        description: "Il scanne le QR, choisit l'une des 20 langues et lit le menu.",
      },
    ],
    note: "Prix et plats du jour se mettent à jour en une seule modification, dans toutes les langues.",
  },
  names: {
    title: "Le nom de vos plats reste le vôtre",
    text: "La carbonara reste la carbonara. MENUO conserve le nom d'origine et traduit la description : le client étranger comprend ce qu'il commande sans perdre l'authenticité. Chaque traduction est modifiable.",
    original: "Cacio e pepe",
    translations: [
      { lang: "EN", text: "Tonnarelli with Pecorino Romano and black pepper" },
      { lang: "DE", text: "Tonnarelli mit Pecorino Romano und schwarzem Pfeffer" },
      { lang: "ES", text: "Tonnarelli con pecorino romano y pimienta negra" },
    ],
  },
  languagesSection: { title: "20 langues, un seul menu", note: "Et d'autres à venir." },
  social: { title: "Déjà adopté par des restaurants comme le vôtre" },
  pricing: {
    ...PRICING_SHARED.fr,
    title: "Choisissez la formule adaptée à votre restaurant",
    subtitle:
      "Toutes les formules incluent 20 langues, les QR codes, l'export PDF, les 14 allergènes UE et l'import depuis une photo ou un PDF.",
    planDesc: {
      essential: "Par ex. votre carte principale",
      business: "Par ex. déjeuner, dîner et carte des vins",
      hospitality: "Par ex. restaurant, bar, petit-déjeuner et room service",
      "multi-location": "Pour les groupes à plusieurs établissements",
    },
    anchor: "Moins de deux cafés par semaine",
    fiscal: "Prix HT · Facture au nom de votre entreprise (n° de TVA)",
    noCommitment: "Sans engagement : résiliable à tout moment",
  },
  faq: {
    title: "Questions fréquentes",
    items: [
      {
        q: "Faut-il une carte bancaire pour l'essai ?",
        a: "Oui, nous la demandons au démarrage, mais rien n'est prélevé pendant 14 jours. Si vous résiliez avant la fin de l'essai, vous ne payez rien.",
      },
      {
        q: "Est-ce que je reçois une facture ?",
        a: "Oui. Indiquez le numéro de TVA de votre entreprise lors de l'abonnement et vous recevez chaque mois (ou chaque année) une facture à son nom.",
      },
      {
        q: "Les traductions sont-elles justes ? Puis-je les modifier ?",
        a: "Les traductions sont générées automatiquement et vous pouvez corriger chaque texte, dans chaque langue. Le nom d’origine des plats ne change pas.",
      },
      {
        q: "Mes clients doivent-ils télécharger une application ?",
        a: "Non. Ils scannent le QR code avec l'appareil photo et le menu s'ouvre dans le navigateur.",
      },
      {
        q: "Comment fonctionnent les allergènes ?",
        a: "Vous indiquez les 14 allergènes UE pour chaque plat et MENUO les affiche traduits dans chaque langue. Le client peut filtrer les plats qui lui conviennent. Les informations restent sous la responsabilité du restaurant.",
      },
      {
        q: "Si je change un prix, dois-je réimprimer le QR ?",
        a: "Non. Le QR code reste toujours le même et vos modifications sont en ligne dans toutes les langues.",
      },
      {
        q: "Qu'est-ce qui compte comme un « menu » ?",
        a: "Chaque carte séparée : par exemple déjeuner, dîner, carte des vins ou desserts.",
      },
      {
        q: "Puis-je résilier quand je veux ?",
        a: "Oui, sans engagement. Résiliez depuis votre compte à tout moment ; votre formule reste active jusqu'à la fin de la période payée.",
      },
    ],
  },
  final: {
    title: "Offrez à chaque client votre menu complet, dans sa langue",
    human: "Vous préférez parler à quelqu'un ? Nous répondons sur WhatsApp.",
    humanEmail: "Vous préférez parler à quelqu'un ? Écrivez-nous :",
    whatsapp: "Écrivez-nous sur WhatsApp",
  },
  footer: { tagline: "Un menu. Toutes les langues.", cookies: "Cookies" },
  chat: { cta: "Parlez-nous maintenant", label: "Chat en direct" },
};
