export const SITE_LOCALES = ["en", "es", "pt", "it", "de", "fr"] as const;
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

export function localeHref(locale: SiteLocale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

type BenefitItem = { title: string; description: string };
type Step = { step: string; title: string; description: string };

export type LandingDict = {
  nav: { benefits: string; howItWorks: string; languages: string; pricing: string; login: string; cta: string };
  hero: {
    badge: string;
    titlePlain: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
  };
  benefits: { eyebrow: string; title: string; subtitle: string; items: BenefitItem[] };
  how: { eyebrow: string; title: string; steps: Step[] };
  languagesSection: { eyebrow: string; title: string; subtitle: string };
  tableGallery: { eyebrow: string; title: string; subtitle: string };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    note: string;
    monthly: string;
    annual: string;
    annualNote: string;
  };
  cta: { titlePrefix: string; titleHighlight: string; titleSuffix: string; subtitle: string; button: string };
};

export const LANDING_CONTENT: Record<SiteLocale, LandingDict> = {
  en: {
    nav: {
      benefits: "Benefits",
      howItWorks: "How it works",
      languages: "Languages",
      pricing: "Pricing",
      login: "Log in",
      cta: "Create your menu",
    },
    hero: {
      badge: "For restaurants that welcome the world",
      titlePlain: "One menu.",
      titleHighlight: "Every language.",
      subtitle:
        "MENUO turns your paper menu into an elegant digital menu, translated instantly into 20 languages, accessed with a single QR code — no app, no download, no awkward guesswork.",
      ctaPrimary: "Build your menu",
      ctaSecondary: "See how it works",
      note: "Ready in minutes",
    },
    benefits: {
      eyebrow: "Why MENUO",
      title: "A menu your guests understand is a menu they spend more on",
      subtitle:
        "MENUO isn't just a translation tool — it's a commercial lever built directly into the guest experience.",
      items: [
        {
          title: "Higher average ticket",
          description:
            "When guests fully understand a dish — its ingredients, its story — they order with confidence. They stop defaulting to the safe, cheap choice and explore your signature and premium dishes instead.",
        },
        {
          title: "Greater profitability",
          description:
            "Update prices, seasonal dishes and daily specials instantly, with no reprinting costs. One digital menu replaces every paper reprint, laminated insert and translated leaflet you used to pay for.",
        },
        {
          title: "A frictionless guest experience",
          description:
            "No app to download, no waiter needed to explain a dish in broken English. Guests scan, pick their language, and understand your menu exactly as you intended it.",
        },
        {
          title: "Access to every nationality",
          description:
            "Tourists and international guests no longer skip dishes they don't understand. Your entire menu — not just the 'safe' items — becomes available to every visitor.",
        },
        {
          title: "A more elegant, modern image",
          description:
            "A refined digital menu signals quality before the first course arrives, reinforcing the positioning of a premium establishment.",
        },
        {
          title: "Ready for what's next",
          description:
            "The same QR your guests already scan will soon let them order straight to the kitchen or pay the bill — no new hardware, no new habit to learn.",
        },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "From paper menu to global menu in three steps",
      steps: [
        {
          step: "01",
          title: "Build your menu",
          description:
            "Add your sections — Starters, Mains, Desserts, Wine — then your dishes: name, ingredients, photo and price. Reorder anything with a click.",
        },
        {
          step: "02",
          title: "Publish & get your QR code",
          description:
            "One click generates a beautiful, print-ready QR code for your tables, window or receipts. No developer, no app store, no waiting.",
        },
        {
          step: "03",
          title: "Guests choose their language",
          description:
            "Before seeing a single dish, guests pick from 20 languages. Every name, ingredient and description appears exactly as you wrote it — in their language.",
        },
      ],
    },
    languagesSection: {
      eyebrow: "20 languages, one menu",
      title: "Speak to every guest, in their own words",
      subtitle:
        "The main languages of every continent, ready from day one — with more added as MENUO grows.",
    },
    tableGallery: {
      eyebrow: "On every table",
      title: "Elegant at every table, in every language",
      subtitle:
        "From a candlelit dinner in Paris to a seaside bistro — a single scan turns MENUO into a menu your guests actually understand.",
    },
    pricing: {
      eyebrow: "Simple pricing",
      title: "Pick the plan that fits your restaurant",
      subtitle:
        "Every plan includes all 20 languages, QR codes and PDF export. Upgrade anytime as you grow.",
      cta: "Subscribe",
      note: "Prices in EUR. Cancel anytime.",
      monthly: "Monthly",
      annual: "Annual",
      annualNote: "2 months free",
    },
    cta: {
      titlePrefix: "Give every guest your",
      titleHighlight: "full",
      titleSuffix: "menu",
      subtitle:
        "Set up your first section in minutes and publish a menu your guests will actually understand — in their language.",
      button: "Create your MENUO menu",
    },
  },

  es: {
    nav: {
      benefits: "Ventajas",
      howItWorks: "Cómo funciona",
      languages: "Idiomas",
      pricing: "Precios",
      login: "Iniciar sesión",
      cta: "Crea tu menú",
    },
    hero: {
      badge: "Para restaurantes que reciben al mundo",
      titlePlain: "Un menú.",
      titleHighlight: "Todos los idiomas.",
      subtitle:
        "MENUO convierte tu carta en papel en un menú digital elegante, traducido al instante a 20 idiomas y accesible con un simple código QR — sin app, sin descargas, sin conjeturas incómodas.",
      ctaPrimary: "Crea tu menú",
      ctaSecondary: "Ver cómo funciona",
      note: "Listo en minutos",
    },
    benefits: {
      eyebrow: "Por qué MENUO",
      title: "Un menú que tus clientes entienden es un menú en el que gastan más",
      subtitle:
        "MENUO no es solo una herramienta de traducción: es una palanca comercial integrada en la experiencia del cliente.",
      items: [
        {
          title: "Mayor ticket medio",
          description:
            "Cuando los clientes entienden completamente un plato — sus ingredientes, su historia — piden con confianza. Dejan de recurrir siempre a la opción segura y barata, y se animan con tus platos estrella y premium.",
        },
        {
          title: "Mayor rentabilidad",
          description:
            "Actualiza precios, platos de temporada y especiales del día al instante, sin coste de reimpresión. Un menú digital sustituye cada reimpresión en papel, inserto plastificado o folleto traducido que antes pagabas.",
        },
        {
          title: "Una experiencia sin fricciones",
          description:
            "Sin apps que descargar, sin camareros que tengan que explicar un plato en un idioma a medias. Los clientes escanean, eligen su idioma y entienden tu menú tal como lo pensaste.",
        },
        {
          title: "Acceso a cualquier nacionalidad",
          description:
            "Turistas y clientes internacionales ya no evitan los platos que no entienden. Todo tu menú — no solo las opciones 'seguras' — está disponible para cada visitante.",
        },
        {
          title: "Una imagen más elegante y moderna",
          description:
            "Un menú digital cuidado transmite calidad incluso antes de que llegue el primer plato, reforzando el posicionamiento de un establecimiento premium.",
        },
        {
          title: "Preparado para lo que viene",
          description:
            "El mismo QR que tus clientes ya escanean pronto les permitirá pedir directamente a cocina o pagar la cuenta — sin nuevo hardware, sin nuevos hábitos que aprender.",
        },
      ],
    },
    how: {
      eyebrow: "Cómo funciona",
      title: "De la carta en papel al menú global en tres pasos",
      steps: [
        {
          step: "01",
          title: "Crea tu menú",
          description:
            "Añade tus secciones — Entrantes, Principales, Postres, Vinos — y tus platos: nombre, ingredientes, foto y precio. Reordena todo con un clic.",
        },
        {
          step: "02",
          title: "Publica y obtén tu código QR",
          description:
            "Un clic genera un código QR elegante y listo para imprimir para tus mesas, escaparate o tickets. Sin programador, sin tienda de apps, sin esperas.",
        },
        {
          step: "03",
          title: "Los clientes eligen su idioma",
          description:
            "Antes de ver un solo plato, los clientes eligen entre 20 idiomas. Cada nombre, ingrediente y descripción aparece tal como lo escribiste — en su idioma.",
        },
      ],
    },
    languagesSection: {
      eyebrow: "20 idiomas, un solo menú",
      title: "Háblale a cada cliente en sus propias palabras",
      subtitle:
        "Los principales idiomas de cada continente, listos desde el primer día — con más añadiéndose a medida que MENUO crece.",
    },
    tableGallery: {
      eyebrow: "En cada mesa",
      title: "Elegante en cada mesa, en cualquier idioma",
      subtitle:
        "De una cena a la luz de las velas en París a un bistró junto al mar — un simple escaneo convierte a MENUO en un menú que tus clientes realmente entienden.",
    },
    pricing: {
      eyebrow: "Precios simples",
      title: "Elige el plan que se ajusta a tu restaurante",
      subtitle:
        "Todos los planes incluyen los 20 idiomas, códigos QR y exportación en PDF. Cambia de plan cuando quieras.",
      cta: "Suscribirse",
      note: "Precios en EUR. Cancela cuando quieras.",
      monthly: "Mensual",
      annual: "Anual",
      annualNote: "2 meses gratis",
    },
    cta: {
      titlePrefix: "Ofrece a cada cliente tu",
      titleHighlight: "menú completo",
      titleSuffix: "",
      subtitle:
        "Configura tu primera sección en minutos y publica un menú que tus clientes realmente entenderán — en su idioma.",
      button: "Crea tu menú MENUO",
    },
  },

  pt: {
    nav: {
      benefits: "Vantagens",
      howItWorks: "Como funciona",
      languages: "Idiomas",
      pricing: "Preços",
      login: "Entrar",
      cta: "Crie o seu menu",
    },
    hero: {
      badge: "Para restaurantes que recebem o mundo",
      titlePlain: "Um menu.",
      titleHighlight: "Todos os idiomas.",
      subtitle:
        "O MENUO transforma a sua carta em papel num menu digital elegante, traduzido instantaneamente para 20 idiomas e acessível com um único código QR — sem aplicação, sem downloads, sem adivinhações.",
      ctaPrimary: "Crie o seu menu",
      ctaSecondary: "Ver como funciona",
      note: "Pronto em minutos",
    },
    benefits: {
      eyebrow: "Porquê o MENUO",
      title: "Um menu que os seus clientes entendem é um menu onde gastam mais",
      subtitle:
        "O MENUO não é apenas uma ferramenta de tradução — é uma alavanca comercial integrada na experiência do cliente.",
      items: [
        {
          title: "Ticket médio mais alto",
          description:
            "Quando os clientes entendem completamente um prato — os seus ingredientes, a sua história — pedem com confiança. Deixam de escolher sempre a opção segura e mais barata e arriscam nos seus pratos de assinatura e premium.",
        },
        {
          title: "Maior rentabilidade",
          description:
            "Atualize preços, pratos sazonais e sugestões do dia instantaneamente, sem custos de reimpressão. Um menu digital substitui cada reimpressão em papel, inserto plastificado e folheto traduzido que costumava pagar.",
        },
        {
          title: "Uma experiência sem fricção",
          description:
            "Sem aplicação para descarregar, sem necessidade de um empregado explicar um prato num idioma incerto. Os clientes fazem scan, escolhem o idioma e entendem o seu menu exatamente como pretendia.",
        },
        {
          title: "Acesso a todas as nacionalidades",
          description:
            "Turistas e clientes internacionais deixam de evitar pratos que não entendem. Todo o seu menu — não só as opções 'seguras' — fica disponível para cada visitante.",
        },
        {
          title: "Uma imagem mais elegante e moderna",
          description:
            "Um menu digital cuidado transmite qualidade antes mesmo de o primeiro prato chegar, reforçando o posicionamento de um estabelecimento premium.",
        },
        {
          title: "Pronto para o que vem a seguir",
          description:
            "O mesmo QR que os seus clientes já digitalizam vai em breve permitir pedir diretamente à cozinha ou pagar a conta — sem novo hardware, sem novos hábitos a aprender.",
        },
      ],
    },
    how: {
      eyebrow: "Como funciona",
      title: "Da carta em papel ao menu global em três passos",
      steps: [
        {
          step: "01",
          title: "Crie o seu menu",
          description:
            "Adicione as suas secções — Entradas, Pratos principais, Sobremesas, Vinhos — e depois os seus pratos: nome, ingredientes, foto e preço. Reorganize tudo com um clique.",
        },
        {
          step: "02",
          title: "Publique e obtenha o seu código QR",
          description:
            "Um clique gera um código QR elegante e pronto a imprimir para as suas mesas, montra ou recibos. Sem programador, sem loja de aplicações, sem esperas.",
        },
        {
          step: "03",
          title: "Os clientes escolhem o idioma",
          description:
            "Antes de ver um único prato, os clientes escolhem entre 20 idiomas. Cada nome, ingrediente e descrição aparece exatamente como o escreveu — no idioma deles.",
        },
      ],
    },
    languagesSection: {
      eyebrow: "20 idiomas, um único menu",
      title: "Fale com cada cliente nas suas próprias palavras",
      subtitle:
        "Os principais idiomas de cada continente, prontos desde o primeiro dia — com mais a serem adicionados à medida que o MENUO cresce.",
    },
    tableGallery: {
      eyebrow: "Em cada mesa",
      title: "Elegante em cada mesa, em qualquer idioma",
      subtitle:
        "De um jantar à luz de velas em Paris a um bistrô à beira-mar — um simples scan transforma o MENUO num menu que os seus clientes realmente entendem.",
    },
    pricing: {
      eyebrow: "Preços simples",
      title: "Escolha o plano ideal para o seu restaurante",
      subtitle:
        "Todos os planos incluem os 20 idiomas, códigos QR e exportação em PDF. Faça upgrade quando quiser.",
      cta: "Assinar",
      note: "Preços em EUR. Cancele quando quiser.",
      monthly: "Mensal",
      annual: "Anual",
      annualNote: "2 meses grátis",
    },
    cta: {
      titlePrefix: "Dê a cada cliente o seu",
      titleHighlight: "menu completo",
      titleSuffix: "",
      subtitle:
        "Configure a sua primeira secção em minutos e publique um menu que os seus clientes vão realmente entender — no idioma deles.",
      button: "Crie o seu menu MENUO",
    },
  },

  it: {
    nav: {
      benefits: "Vantaggi",
      howItWorks: "Come funziona",
      languages: "Lingue",
      pricing: "Prezzi",
      login: "Accedi",
      cta: "Crea il tuo menu",
    },
    hero: {
      badge: "Per ristoranti che accolgono il mondo",
      titlePlain: "Un menu.",
      titleHighlight: "Ogni lingua.",
      subtitle:
        "MENUO trasforma il tuo menu cartaceo in un elegante menu digitale, tradotto all'istante in 20 lingue e accessibile con un semplice codice QR — niente app, niente download, niente equivoci.",
      ctaPrimary: "Crea il tuo menu",
      ctaSecondary: "Scopri come funziona",
      note: "Pronto in pochi minuti",
    },
    benefits: {
      eyebrow: "Perché MENUO",
      title: "Un menu che i tuoi ospiti capiscono è un menu su cui spendono di più",
      subtitle:
        "MENUO non è solo uno strumento di traduzione: è una leva commerciale integrata direttamente nell'esperienza del cliente.",
      items: [
        {
          title: "Scontrino medio più alto",
          description:
            "Quando gli ospiti capiscono davvero un piatto — i suoi ingredienti, la sua storia — ordinano con più sicurezza. Smettono di scegliere sempre l'opzione sicura ed economica e si lasciano tentare dai piatti signature e premium.",
        },
        {
          title: "Maggiore redditività",
          description:
            "Aggiorna prezzi, piatti stagionali e specialità del giorno all'istante, senza costi di ristampa. Un menu digitale sostituisce ogni ristampa cartacea, inserto plastificato e volantino tradotto che pagavi prima.",
        },
        {
          title: "Un'esperienza senza attriti",
          description:
            "Nessuna app da scaricare, nessun cameriere costretto a spiegare un piatto in un inglese incerto. Gli ospiti scansionano, scelgono la lingua e capiscono il menu esattamente come lo hai pensato.",
        },
        {
          title: "Accesso a ogni nazionalità",
          description:
            "Turisti e ospiti internazionali non evitano più i piatti che non capiscono. L'intero menu — non solo le opzioni 'sicure' — diventa disponibile per ogni visitatore.",
        },
        {
          title: "Un'immagine più elegante e moderna",
          description:
            "Un menu digitale curato comunica qualità ancora prima che arrivi la prima portata, rafforzando il posizionamento di un locale premium.",
        },
        {
          title: "Pronto per il prossimo passo",
          description:
            "Lo stesso QR che i tuoi ospiti scansionano già presto permetterà di ordinare direttamente in cucina o pagare il conto — senza nuovo hardware, senza nuove abitudini da imparare.",
        },
      ],
    },
    how: {
      eyebrow: "Come funziona",
      title: "Dal menu cartaceo al menu globale in tre passaggi",
      steps: [
        {
          step: "01",
          title: "Crea il tuo menu",
          description:
            "Aggiungi le tue sezioni — Antipasti, Primi, Dolci, Vini — poi i tuoi piatti: nome, ingredienti, foto e prezzo. Riordina tutto con un clic.",
        },
        {
          step: "02",
          title: "Pubblica e ottieni il tuo codice QR",
          description:
            "Un clic genera un codice QR elegante e pronto per la stampa per i tavoli, la vetrina o gli scontrini. Nessuno sviluppatore, nessun app store, nessuna attesa.",
        },
        {
          step: "03",
          title: "Gli ospiti scelgono la lingua",
          description:
            "Prima ancora di vedere un piatto, gli ospiti scelgono tra 20 lingue. Ogni nome, ingrediente e descrizione appare esattamente come lo hai scritto — nella loro lingua.",
        },
      ],
    },
    languagesSection: {
      eyebrow: "20 lingue, un solo menu",
      title: "Parla a ogni ospite, nelle sue stesse parole",
      subtitle:
        "Le lingue principali di ogni continente, pronte fin dal primo giorno — con altre in arrivo man mano che MENUO cresce.",
    },
    tableGallery: {
      eyebrow: "Ad ogni tavolo",
      title: "Elegante ad ogni tavolo, in ogni lingua",
      subtitle:
        "Da una cena a lume di candela a Parigi a un bistrot sul mare — una semplice scansione trasforma MENUO in un menu che i tuoi ospiti capiscono davvero.",
    },
    pricing: {
      eyebrow: "Prezzi semplici",
      title: "Scegli il piano adatto al tuo ristorante",
      subtitle:
        "Ogni piano include tutte le 20 lingue, codici QR ed esportazione PDF. Aggiorna il piano quando vuoi.",
      cta: "Abbonati",
      note: "Prezzi in EUR. Annulla quando vuoi.",
      monthly: "Mensile",
      annual: "Annuale",
      annualNote: "2 mesi gratis",
    },
    cta: {
      titlePrefix: "Offri a ogni ospite il tuo",
      titleHighlight: "menu completo",
      titleSuffix: "",
      subtitle:
        "Configura la tua prima sezione in pochi minuti e pubblica un menu che i tuoi ospiti capiranno davvero — nella loro lingua.",
      button: "Crea il tuo menu MENUO",
    },
  },

  de: {
    nav: {
      benefits: "Vorteile",
      howItWorks: "So funktioniert's",
      languages: "Sprachen",
      pricing: "Preise",
      login: "Anmelden",
      cta: "Menü erstellen",
    },
    hero: {
      badge: "Für Restaurants, die die Welt willkommen heißen",
      titlePlain: "Eine Speisekarte.",
      titleHighlight: "Jede Sprache.",
      subtitle:
        "MENUO verwandelt Ihre Papier-Speisekarte in eine elegante digitale Speisekarte, sofort in 20 Sprachen übersetzt und über einen einzigen QR-Code zugänglich — keine App, kein Download, kein unsicheres Rätselraten.",
      ctaPrimary: "Speisekarte erstellen",
      ctaSecondary: "So funktioniert's",
      note: "In wenigen Minuten startklar",
    },
    benefits: {
      eyebrow: "Warum MENUO",
      title: "Eine Speisekarte, die Ihre Gäste verstehen, ist eine Speisekarte, bei der sie mehr ausgeben",
      subtitle:
        "MENUO ist nicht nur ein Übersetzungstool — es ist ein kommerzieller Hebel, der direkt im Gästeerlebnis verankert ist.",
      items: [
        {
          title: "Höherer Durchschnittsbon",
          description:
            "Wenn Gäste ein Gericht vollständig verstehen — seine Zutaten, seine Geschichte —, bestellen sie mit Zuversicht. Sie greifen nicht mehr automatisch zur sicheren, günstigen Wahl, sondern trauen sich an Ihre Signature- und Premium-Gerichte.",
        },
        {
          title: "Höhere Profitabilität",
          description:
            "Aktualisieren Sie Preise, saisonale Gerichte und Tagesangebote sofort, ganz ohne Druckkosten. Eine digitale Speisekarte ersetzt jeden Papiernachdruck, jedes laminierte Einlegeblatt und jedes übersetzte Faltblatt, das Sie bisher bezahlt haben.",
        },
        {
          title: "Ein reibungsloses Gästeerlebnis",
          description:
            "Keine App zum Herunterladen, kein Kellner, der ein Gericht in gebrochenem Englisch erklären muss. Gäste scannen, wählen ihre Sprache und verstehen Ihre Speisekarte genau so, wie Sie sie gemeint haben.",
        },
        {
          title: "Zugang für jede Nationalität",
          description:
            "Touristen und internationale Gäste überspringen keine Gerichte mehr, die sie nicht verstehen. Ihre gesamte Speisekarte — nicht nur die 'sicheren' Optionen — steht jedem Besucher offen.",
        },
        {
          title: "Ein eleganteres, moderneres Erscheinungsbild",
          description:
            "Eine hochwertig gestaltete digitale Speisekarte signalisiert Qualität, noch bevor der erste Gang serviert wird, und unterstreicht die Positionierung als Premium-Betrieb.",
        },
        {
          title: "Bereit für das, was als Nächstes kommt",
          description:
            "Derselbe QR-Code, den Ihre Gäste bereits scannen, wird ihnen bald erlauben, direkt in der Küche zu bestellen oder die Rechnung zu bezahlen — ohne neue Hardware, ohne neue Gewohnheiten.",
        },
      ],
    },
    how: {
      eyebrow: "So funktioniert's",
      title: "In drei Schritten von der Papierkarte zur globalen Speisekarte",
      steps: [
        {
          step: "01",
          title: "Speisekarte erstellen",
          description:
            "Fügen Sie Ihre Bereiche hinzu — Vorspeisen, Hauptgerichte, Desserts, Weine — und dann Ihre Gerichte: Name, Zutaten, Foto und Preis. Alles lässt sich mit einem Klick neu anordnen.",
        },
        {
          step: "02",
          title: "Veröffentlichen & QR-Code erhalten",
          description:
            "Ein Klick erzeugt einen eleganten, druckfertigen QR-Code für Ihre Tische, Ihr Schaufenster oder Ihre Rechnungen. Kein Entwickler, kein App Store, keine Wartezeit.",
        },
        {
          step: "03",
          title: "Gäste wählen ihre Sprache",
          description:
            "Bevor sie auch nur ein Gericht sehen, wählen die Gäste aus 20 Sprachen. Jeder Name, jede Zutat und jede Beschreibung erscheint genau so, wie Sie sie geschrieben haben — in ihrer Sprache.",
        },
      ],
    },
    languagesSection: {
      eyebrow: "20 Sprachen, eine Speisekarte",
      title: "Sprechen Sie jeden Gast in seiner eigenen Sprache an",
      subtitle:
        "Die wichtigsten Sprachen jedes Kontinents, von Anfang an verfügbar — mit weiteren, während MENUO wächst.",
    },
    tableGallery: {
      eyebrow: "An jedem Tisch",
      title: "Elegant an jedem Tisch, in jeder Sprache",
      subtitle:
        "Von einem Candle-Light-Dinner in Paris bis zu einem Bistro am Meer — ein einfacher Scan macht MENUO zu einer Speisekarte, die Ihre Gäste wirklich verstehen.",
    },
    pricing: {
      eyebrow: "Einfache Preise",
      title: "Wählen Sie den passenden Plan für Ihr Restaurant",
      subtitle:
        "Jeder Plan enthält alle 20 Sprachen, QR-Codes und PDF-Export. Jederzeit upgradebar.",
      cta: "Abonnieren",
      note: "Preise in EUR. Jederzeit kündbar.",
      monthly: "Monatlich",
      annual: "Jährlich",
      annualNote: "2 Monate gratis",
    },
    cta: {
      titlePrefix: "Geben Sie jedem Gast Ihre",
      titleHighlight: "vollständige Speisekarte",
      titleSuffix: "",
      subtitle:
        "Richten Sie Ihren ersten Bereich in wenigen Minuten ein und veröffentlichen Sie eine Speisekarte, die Ihre Gäste wirklich verstehen — in ihrer Sprache.",
      button: "MENUO-Speisekarte erstellen",
    },
  },

  fr: {
    nav: {
      benefits: "Avantages",
      howItWorks: "Comment ça marche",
      languages: "Langues",
      pricing: "Tarifs",
      login: "Connexion",
      cta: "Créez votre menu",
    },
    hero: {
      badge: "Pour les restaurants qui accueillent le monde entier",
      titlePlain: "Un menu.",
      titleHighlight: "Toutes les langues.",
      subtitle:
        "MENUO transforme votre carte papier en un élégant menu numérique, traduit instantanément en 20 langues et accessible via un simple code QR — sans application, sans téléchargement, sans devinettes gênantes.",
      ctaPrimary: "Créez votre menu",
      ctaSecondary: "Voir comment ça marche",
      note: "Prêt en quelques minutes",
    },
    benefits: {
      eyebrow: "Pourquoi MENUO",
      title: "Un menu que vos clients comprennent est un menu sur lequel ils dépensent plus",
      subtitle:
        "MENUO n'est pas qu'un outil de traduction — c'est un levier commercial intégré directement à l'expérience client.",
      items: [
        {
          title: "Un ticket moyen plus élevé",
          description:
            "Lorsque les clients comprennent pleinement un plat — ses ingrédients, son histoire — ils commandent en toute confiance. Ils cessent de se rabattre sur le choix sûr et bon marché et osent vos plats signature et premium.",
        },
        {
          title: "Une meilleure rentabilité",
          description:
            "Mettez à jour les prix, les plats de saison et les suggestions du jour instantanément, sans frais de réimpression. Un menu numérique remplace chaque réimpression papier, insert plastifié et dépliant traduit que vous payiez auparavant.",
        },
        {
          title: "Une expérience client sans friction",
          description:
            "Aucune application à télécharger, aucun serveur obligé d'expliquer un plat dans un anglais approximatif. Les clients scannent, choisissent leur langue et comprennent votre menu exactement comme vous l'avez conçu.",
        },
        {
          title: "Accessible à toutes les nationalités",
          description:
            "Les touristes et clients internationaux ne passent plus les plats qu'ils ne comprennent pas. Tout votre menu — pas seulement les valeurs sûres — devient accessible à chaque visiteur.",
        },
        {
          title: "Une image plus élégante et moderne",
          description:
            "Un menu numérique soigné signale la qualité avant même l'arrivée du premier plat, renforçant le positionnement d'un établissement haut de gamme.",
        },
        {
          title: "Prêt pour la suite",
          description:
            "Le même QR code que vos clients scannent déjà leur permettra bientôt de commander directement en cuisine ou de régler l'addition — sans nouveau matériel, sans nouvelle habitude à apprendre.",
        },
      ],
    },
    how: {
      eyebrow: "Comment ça marche",
      title: "De la carte papier au menu mondial en trois étapes",
      steps: [
        {
          step: "01",
          title: "Créez votre menu",
          description:
            "Ajoutez vos rubriques — Entrées, Plats, Desserts, Vins — puis vos plats : nom, ingrédients, photo et prix. Réorganisez le tout en un clic.",
        },
        {
          step: "02",
          title: "Publiez et obtenez votre code QR",
          description:
            "Un clic génère un magnifique code QR prêt à imprimer pour vos tables, votre vitrine ou vos tickets de caisse. Pas de développeur, pas d'app store, pas d'attente.",
        },
        {
          step: "03",
          title: "Les clients choisissent leur langue",
          description:
            "Avant même de voir un seul plat, les clients choisissent parmi 20 langues. Chaque nom, ingrédient et description apparaît exactement comme vous l'avez écrit — dans leur langue.",
        },
      ],
    },
    languagesSection: {
      eyebrow: "20 langues, un seul menu",
      title: "Parlez à chaque client dans sa propre langue",
      subtitle:
        "Les principales langues de chaque continent, disponibles dès le premier jour — et d'autres à venir à mesure que MENUO grandit.",
    },
    tableGallery: {
      eyebrow: "À chaque table",
      title: "Élégant à chaque table, dans toutes les langues",
      subtitle:
        "D'un dîner aux chandelles à Paris à un bistrot en bord de mer — un simple scan transforme MENUO en un menu que vos clients comprennent vraiment.",
    },
    pricing: {
      eyebrow: "Tarifs simples",
      title: "Choisissez la formule adaptée à votre restaurant",
      subtitle:
        "Chaque formule inclut les 20 langues, les codes QR et l'export PDF. Changez de formule à tout moment.",
      cta: "S'abonner",
      note: "Prix en EUR. Annulable à tout moment.",
      monthly: "Mensuel",
      annual: "Annuel",
      annualNote: "2 mois offerts",
    },
    cta: {
      titlePrefix: "Offrez à chaque client votre",
      titleHighlight: "menu complet",
      titleSuffix: "",
      subtitle:
        "Configurez votre première rubrique en quelques minutes et publiez un menu que vos clients comprendront vraiment — dans leur langue.",
      button: "Créez votre menu MENUO",
    },
  },
};
