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
    trialNote: string;
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
      note: "14-day free trial",
    },
    benefits: {
      eyebrow: "Why MENUO",
      title: "A menu your guests understand is a menu they spend more on",
      subtitle:
        "MENUO isn't just a translation. It's a tool that helps your restaurant sell more and run better, every single day.",
      items: [
        {
          title: "Higher average ticket",
          description:
            "When guests understand a dish (its ingredients, how it's prepared, its story), they order with confidence. They stop picking the safest, cheapest option and take a chance on your signature dishes, starters and wine.",
        },
        {
          title: "Your team serves, not translates",
          description:
            "In high season, every minute counts. With the menu in each guest's language, staff stop explaining dishes in improvised English, orders go out faster and tables turn more often. No need to hire staff who speak five languages.",
        },
        {
          title: "Fewer misunderstandings, better reviews",
          description:
            "“It wasn't what I expected” is one of the most common tourist complaints on Google and TripAdvisor. When guests know exactly what they ordered, they leave happy, and that's what brings the next tourist to your door.",
        },
        {
          title: "Change your menu in seconds, no reprinting",
          description:
            "Prices, seasonal dishes and daily specials update in one click, in every language at once. Prefer paper? Export your menu as a PDF in any language. All from €9.90/month, less than a single reprint.",
        },
        {
          title: "Ready today, no risk",
          description:
            "No app, no developer, no contract. Build your menu in minutes, print the QR code and you're up and running. Try it free for 14 days and cancel anytime.",
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
      trialNote: "14-day free trial",
      note: "Cancel anytime.",
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
      note: "Prueba gratis de 14 días",
    },
    benefits: {
      eyebrow: "Por qué MENUO",
      title: "Un menú que tus clientes entienden es un menú en el que gastan más",
      subtitle:
        "MENUO no es solo una traducción. Es una herramienta que hace que tu restaurante venda más y funcione mejor, todos los días.",
      items: [
        {
          title: "Mayor ticket medio",
          description:
            "Cuando el cliente entiende el plato (los ingredientes, la preparación, la historia), pide con confianza. Deja de elegir lo más seguro y barato y se anima con los platos estrella, los entrantes y el vino.",
        },
        {
          title: "Tu equipo sirve, no traduce",
          description:
            "En temporada alta, cada minuto cuenta. Con el menú en el idioma de cada cliente, los camareros dejan de explicar platos en un inglés improvisado, los pedidos salen más rápido y las mesas rotan más. No necesitas contratar personal que hable cinco idiomas.",
        },
        {
          title: "Menos malentendidos, mejores reseñas",
          description:
            "“No era lo que esperaba” es una de las quejas más habituales de los turistas en Google y TripAdvisor. Cuando el cliente sabe exactamente lo que pidió, se va satisfecho, y eso es lo que trae al próximo turista a tu puerta.",
        },
        {
          title: "Cambia el menú en segundos, sin reimprimir",
          description:
            "Precios, platos de temporada y sugerencias del día se actualizan con un clic, en todos los idiomas a la vez. Y si prefieres papel, exporta el menú en PDF en el idioma que quieras. Todo desde 9,90 €/mes, menos que una sola reimpresión.",
        },
        {
          title: "Listo hoy, sin riesgos",
          description:
            "Sin app, sin programador, sin contrato. Crea tu menú en minutos, imprime el código QR y ya está funcionando. Pruébalo gratis 14 días y cancela cuando quieras.",
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
      trialNote: "Prueba gratis de 14 días",
      note: "Cancela cuando quieras.",
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
        "O MENUO transforma a sua ementa em papel num menu digital elegante, traduzido instantaneamente para 20 idiomas e acessível com um único código QR — sem aplicação, sem downloads, sem adivinhações.",
      ctaPrimary: "Crie o seu menu",
      ctaSecondary: "Ver como funciona",
      note: "Teste grátis de 14 dias",
    },
    benefits: {
      eyebrow: "Porquê o MENUO",
      title: "Um menu que os seus clientes entendem é um menu onde gastam mais",
      subtitle:
        "O MENUO não é só uma tradução. É uma ferramenta que faz o seu restaurante vender mais e trabalhar melhor, todos os dias.",
      items: [
        {
          title: "Ticket médio mais alto",
          description:
            "Quando o cliente entende o prato (os ingredientes, a preparação, a história), pede com confiança. Deixa de escolher o mais seguro e mais barato e arrisca nos pratos de assinatura, nas entradas e no vinho.",
        },
        {
          title: "A sua equipa serve, não traduz",
          description:
            "Na época alta, cada minuto conta. Com o menu no idioma de cada cliente, os empregados deixam de explicar pratos em inglês improvisado, os pedidos saem mais rápido e as mesas rodam mais. Não precisa de contratar pessoal que fale cinco línguas.",
        },
        {
          title: "Menos mal-entendidos, melhores avaliações",
          description:
            "“Não era o que eu esperava” é uma das queixas mais comuns dos turistas no Google e no TripAdvisor. Quando o cliente sabe exatamente o que pediu, sai satisfeito, e é isso que traz o próximo turista à sua porta.",
        },
        {
          title: "Mude o menu em segundos, sem reimprimir",
          description:
            "Preços, pratos da época e sugestões do dia são atualizados num clique, em todos os idiomas ao mesmo tempo. E se preferir papel, exporte o menu em PDF no idioma que quiser. Tudo a partir de €9,90/mês, menos do que uma única reimpressão.",
        },
        {
          title: "Pronto hoje, sem riscos",
          description:
            "Sem aplicação, sem programador, sem contrato. Cria o menu em minutos, imprime o código QR e está a funcionar. Experimente 14 dias grátis e cancele quando quiser.",
        },
      ],
    },
    how: {
      eyebrow: "Como funciona",
      title: "Da ementa em papel ao menu global em três passos",
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
      trialNote: "Teste grátis de 14 dias",
      note: "Cancele quando quiser.",
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
      note: "Prova gratuita di 14 giorni",
    },
    benefits: {
      eyebrow: "Perché MENUO",
      title: "Un menu che i tuoi ospiti capiscono è un menu su cui spendono di più",
      subtitle:
        "MENUO non è solo una traduzione. È uno strumento che fa vendere di più il tuo ristorante e lo fa lavorare meglio, ogni giorno.",
      items: [
        {
          title: "Scontrino medio più alto",
          description:
            "Quando l'ospite capisce il piatto (gli ingredienti, la preparazione, la storia), ordina con sicurezza. Smette di scegliere l'opzione più sicura ed economica e si lascia tentare dai piatti signature, dagli antipasti e dal vino.",
        },
        {
          title: "Il tuo staff serve, non traduce",
          description:
            "In alta stagione ogni minuto conta. Con il menu nella lingua di ogni ospite, i camerieri smettono di spiegare i piatti in un inglese improvvisato, le comande escono più velocemente e i tavoli girano di più. Non serve assumere personale che parli cinque lingue.",
        },
        {
          title: "Meno equivoci, recensioni migliori",
          description:
            "“Non era quello che mi aspettavo” è una delle lamentele più frequenti dei turisti su Google e TripAdvisor. Quando l'ospite sa esattamente cosa ha ordinato, esce soddisfatto, ed è questo che porta il prossimo turista alla tua porta.",
        },
        {
          title: "Cambia il menu in pochi secondi, senza ristampare",
          description:
            "Prezzi, piatti di stagione e suggerimenti del giorno si aggiornano con un clic, in tutte le lingue contemporaneamente. E se preferisci la carta, esporta il menu in PDF nella lingua che vuoi. Tutto a partire da €9,90/mese, meno di una sola ristampa.",
        },
        {
          title: "Pronto oggi, senza rischi",
          description:
            "Niente app, niente sviluppatori, niente contratti. Crei il menu in pochi minuti, stampi il codice QR e sei operativo. Provalo gratis per 14 giorni e annulla quando vuoi.",
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
      trialNote: "Prova gratuita di 14 giorni",
      note: "Annulla quando vuoi.",
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
      note: "14 Tage kostenlos testen",
    },
    benefits: {
      eyebrow: "Warum MENUO",
      title: "Eine Speisekarte, die Ihre Gäste verstehen, ist eine Speisekarte, bei der sie mehr ausgeben",
      subtitle:
        "MENUO ist nicht nur eine Übersetzung. Es ist ein Werkzeug, mit dem Ihr Restaurant jeden Tag mehr verkauft und besser arbeitet.",
      items: [
        {
          title: "Höherer Durchschnittsbon",
          description:
            "Wenn Gäste ein Gericht verstehen (die Zutaten, die Zubereitung, die Geschichte), bestellen sie mit Zuversicht. Sie wählen nicht mehr das Sicherste und Günstigste, sondern trauen sich an Signature-Gerichte, Vorspeisen und Wein.",
        },
        {
          title: "Ihr Team serviert, statt zu übersetzen",
          description:
            "In der Hochsaison zählt jede Minute. Mit der Speisekarte in der Sprache jedes Gastes muss Ihr Personal Gerichte nicht mehr in improvisiertem Englisch erklären, Bestellungen gehen schneller raus und die Tische werden öfter belegt. Sie müssen kein Personal einstellen, das fünf Sprachen spricht.",
        },
        {
          title: "Weniger Missverständnisse, bessere Bewertungen",
          description:
            "„Das war nicht, was ich erwartet hatte“ ist eine der häufigsten Beschwerden von Touristen auf Google und TripAdvisor. Wenn Gäste genau wissen, was sie bestellt haben, gehen sie zufrieden, und genau das bringt den nächsten Touristen zu Ihnen.",
        },
        {
          title: "Speisekarte in Sekunden ändern, ohne Neudruck",
          description:
            "Preise, Saisongerichte und Tagesempfehlungen werden mit einem Klick aktualisiert, in allen Sprachen gleichzeitig. Und wenn Sie Papier bevorzugen, exportieren Sie die Speisekarte als PDF in jeder gewünschten Sprache. Alles ab 9,90 €/Monat, weniger als ein einziger Neudruck.",
        },
        {
          title: "Heute startklar, ohne Risiko",
          description:
            "Keine App, kein Entwickler, kein Vertrag. Erstellen Sie Ihre Speisekarte in wenigen Minuten, drucken Sie den QR-Code aus und schon läuft es. Testen Sie 14 Tage kostenlos und kündigen Sie jederzeit.",
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
      trialNote: "14 Tage kostenlos testen",
      note: "Jederzeit kündbar.",
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
      note: "Essai gratuit de 14 jours",
    },
    benefits: {
      eyebrow: "Pourquoi MENUO",
      title: "Un menu que vos clients comprennent est un menu sur lequel ils dépensent plus",
      subtitle:
        "MENUO n'est pas qu'une traduction. C'est un outil qui aide votre restaurant à vendre plus et à mieux travailler, tous les jours.",
      items: [
        {
          title: "Un ticket moyen plus élevé",
          description:
            "Quand le client comprend le plat (les ingrédients, la préparation, l'histoire), il commande en confiance. Il cesse de choisir le plus sûr et le moins cher et ose les plats signature, les entrées et le vin.",
        },
        {
          title: "Votre équipe sert, elle ne traduit pas",
          description:
            "En haute saison, chaque minute compte. Avec le menu dans la langue de chaque client, les serveurs n'expliquent plus les plats dans un anglais improvisé, les commandes partent plus vite et les tables tournent davantage. Inutile d'embaucher du personnel qui parle cinq langues.",
        },
        {
          title: "Moins de malentendus, de meilleurs avis",
          description:
            "« Ce n'était pas ce que j'attendais » est l'une des plaintes les plus fréquentes des touristes sur Google et TripAdvisor. Quand le client sait exactement ce qu'il a commandé, il repart satisfait, et c'est ce qui amène le prochain touriste à votre porte.",
        },
        {
          title: "Modifiez le menu en quelques secondes, sans réimprimer",
          description:
            "Prix, plats de saison et suggestions du jour se mettent à jour en un clic, dans toutes les langues à la fois. Et si vous préférez le papier, exportez le menu en PDF dans la langue de votre choix. Le tout à partir de 9,90 €/mois, moins qu'une seule réimpression.",
        },
        {
          title: "Prêt aujourd'hui, sans risque",
          description:
            "Sans application, sans développeur, sans engagement. Créez votre menu en quelques minutes, imprimez le code QR et c'est parti. Essayez gratuitement pendant 14 jours et annulez quand vous voulez.",
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
      trialNote: "Essai gratuit de 14 jours",
      note: "Annulable à tout moment.",
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
