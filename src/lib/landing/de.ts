import type { LandingDict } from "../landing-content";
import { PRICING_SHARED } from "./pricing-shared";

export const de: LandingDict = {
  nav: { demo: "Demo", how: "So funktioniert's", pricing: "Preise", faq: "FAQ", login: "Anmelden" },
  cta: "14 Tage kostenlos testen",
  hero: {
    eyebrow: "Für Restaurants, die Gäste aus aller Welt empfangen",
    titlePlain: "Eine Speisekarte.",
    titleHighlight: "Jede Sprache.",
    subtitle:
      "Laden Sie ein Foto oder PDF Ihrer Speisekarte hoch: In wenigen Minuten wird daraus eine digitale Karte in 20 Sprachen, mit korrekt ausgewiesenen Allergenen. Internationale Gäste scannen einen QR-Code und lesen alles in ihrer Sprache – ganz ohne App.",
    cta2: "Live-Demo ansehen",
    trust: ["14 Tage kostenlos", "Keine App für Gäste", "Jederzeit kündbar"],
    imageAlt: "MENUO-Tischaufsteller mit QR-Code auf einem Restauranttisch in der toskanischen Landschaft",
  },
  demo: {
    title: "Ihre Karte mit den Augen eines Touristen",
    text: "Scannen Sie den QR-Code oder tippen Sie auf den Button: Die Karte einer Beispiel-Trattoria öffnet sich – genau so, wie Ihre Gäste sie sehen würden.",
    bullets: ["Sprache mit einem Tipp wechseln", "Glutenfreie, krebstierfreie oder vegane Gerichte filtern"],
    namesBullet: "Sehen, wie die Gerichtsnamen in der Originalsprache bleiben",
    button: "Beispielkarte öffnen",
    scan: "Mit dem Handy scannen",
  },
  benefits: {
    title: "Eine Karte, die Gäste verstehen, ist eine Karte, bei der sie mehr bestellen",
    items: [
      {
        title: "Höherer Durchschnittsbon",
        description: "Wer versteht, was er bestellt, traut sich mehr: Vorspeisen, Spezialitäten des Hauses, Wein.",
      },
      {
        title: "Allergene immer korrekt",
        description:
          "Alle 14 nach EU-Verordnung 1169/2011 kennzeichnungspflichtigen Allergene sind markiert und in jede Sprache übersetzt. Gäste filtern selbst die passenden Gerichte.",
      },
      {
        title: "Ihr Team arbeitet entspannter",
        description:
          "Schluss damit, jedes Gericht in improvisiertem Englisch zu erklären. Bestellungen gehen schneller und Tische werden früher wieder frei.",
      },
      {
        title: "Weniger Missverständnisse, bessere Bewertungen",
        description:
          "Wer weiß, was er bestellt hat, erlebt keine Überraschungen – und schreibt das bei Google und TripAdvisor.",
      },
    ],
  },
  how: {
    title: "Von der Papierkarte zur Karte in 20 Sprachen – in drei Schritten",
    steps: [
      { title: "Foto oder PDF hochladen", description: "Künstliche Intelligenz erkennt Rubriken, Gerichte und Preise." },
      {
        title: "Prüfen und veröffentlichen",
        description:
          "Ändern Sie, was Sie möchten, fügen Sie Fotos hinzu und laden Sie den druckfertigen QR-Code für Tische, Schaufenster oder Kassenbons herunter.",
      },
      {
        title: "Gäste wählen ihre Sprache",
        description: "Sie scannen den QR-Code, wählen eine von 20 Sprachen und lesen die Karte.",
      },
    ],
    note: "Preise und Tagesgerichte aktualisieren Sie mit einer einzigen Änderung – in allen Sprachen.",
  },
  names: {
    title: "Ihre Gerichte behalten ihren Namen",
    text: "Carbonara bleibt Carbonara. MENUO behält den Originalnamen und übersetzt die Beschreibung – so verstehen internationale Gäste, was sie bestellen, ohne dass die Authentizität verloren geht. Jede Übersetzung lässt sich bearbeiten.",
    original: "Cacio e pepe",
    translations: [
      { lang: "EN", text: "Tonnarelli with Pecorino Romano and black pepper" },
      { lang: "FR", text: "Tonnarelli au pecorino romano et poivre noir" },
      { lang: "ES", text: "Tonnarelli con pecorino romano y pimienta negra" },
    ],
  },
  languagesSection: { title: "20 Sprachen, eine Karte", note: "Weitere folgen." },
  social: { title: "Restaurants wie Ihres nutzen MENUO bereits" },
  pricing: {
    ...PRICING_SHARED.de,
    title: "Wählen Sie den passenden Tarif für Ihr Restaurant",
    subtitle:
      "Alle Tarife enthalten 20 Sprachen, QR-Codes, PDF-Export, alle 14 EU-Allergene und den KI-Import aus Foto oder PDF.",
    planDesc: {
      essential: "Z. B. Ihre Hauptkarte",
      business: "Z. B. Mittag, Abend und Weinkarte",
      hospitality: "Z. B. Restaurant, Bar, Frühstück und Room Service",
      "multi-location": "Für Gruppen mit mehreren Standorten",
    },
    anchor: "Weniger als ein Kaffee pro Woche",
    fiscal: "Preise zzgl. MwSt. · Rechnung auf Ihre Firma (USt-IdNr.)",
    noCommitment: "Keine Mindestlaufzeit: jederzeit kündbar",
    securePayment: "Sichere Zahlung über Stripe",
    noChargeTrial: "14 Tage keine Abbuchung",
  },
  faq: {
    title: "Häufige Fragen",
    items: [
      {
        q: "Brauche ich für den Test eine Kreditkarte?",
        a: "Ja, wir fragen beim Start danach, aber 14 Tage lang wird nichts abgebucht. Wenn Sie vor Ende des Tests kündigen, zahlen Sie nichts.",
      },
      {
        q: "Bekomme ich eine Rechnung?",
        a: "Ja. Geben Sie beim Abschluss die USt-IdNr. Ihres Unternehmens an und Sie erhalten jeden Monat (oder jedes Jahr) eine Rechnung auf Ihre Firma.",
      },
      {
        q: "Sind die Übersetzungen korrekt? Kann ich sie bearbeiten?",
        a: "Die Übersetzungen entstehen automatisch, und Sie können jeden Text in jeder Sprache korrigieren. Die Originalnamen der Gerichte bleiben unverändert.",
      },
      {
        q: "Müssen meine Gäste eine App herunterladen?",
        a: "Nein. Sie scannen den QR-Code mit der Kamera, und die Karte öffnet sich im Browser.",
      },
      {
        q: "Wie funktionieren die Allergene?",
        a: "Sie markieren die 14 EU-Allergene für jedes Gericht, und MENUO zeigt sie in jeder Sprache übersetzt an. Gäste können die passenden Gerichte filtern. Die Verantwortung für die Angaben bleibt beim Restaurant.",
      },
      {
        q: "Muss ich den QR-Code neu drucken, wenn ich einen Preis ändere?",
        a: "Nein. Der QR-Code bleibt immer derselbe, und Ihre Änderungen sind in allen Sprachen online.",
      },
      { q: "Was zählt als „Karte“?", a: "Jede eigene Karte: zum Beispiel Mittag, Abend, Weinkarte oder Desserts." },
      {
        q: "Kann ich jederzeit kündigen?",
        a: "Ja, ohne Mindestlaufzeit. Kündigen Sie jederzeit in Ihrem Konto; Ihr Tarif bleibt bis zum Ende des bezahlten Zeitraums aktiv.",
      },
    ],
  },
  final: {
    title: "Geben Sie jedem Gast Ihre ganze Karte – in seiner Sprache",
    human: "Lieber mit einem Menschen sprechen? Wir antworten auf WhatsApp.",
    humanEmail: "Lieber mit einem Menschen sprechen? Schreiben Sie uns:",
    whatsapp: "Auf WhatsApp schreiben",
  },
  footer: { tagline: "Eine Speisekarte. Jede Sprache.", cookies: "Cookies" },
  chat: { cta: "Jetzt mit uns sprechen", label: "Live-Chat" },
};
