import { builderLocale, BuilderLocale } from "@/lib/builder-content";

/** Onboarding emails. Same language rule as the dashboard: the first menu's
 * source language picks PT-PT / Italian, else English.
 * - buildOnboardingEmail: a few hours after signup, account not live yet
 *   ("empty" / "hasDishes" for the old build-first flow, "choosePlan" for
 *   card-required accounts that never finished checkout).
 * - buildTrialWelcomeEmail: the moment the free trial starts.
 * - buildTrialNudgeEmail: 48 h into the trial with no dishes yet. */

type Stage = "empty" | "hasDishes" | "choosePlan";

type Common = {
  greeting: string;
  signoff: string;
  team: string;
  questions: string;
  translations: string;
  dateLocale: string;
};

const TEXT: Record<
  BuilderLocale,
  Common & {
    empty: { subject: string; intro: string; steps: string[]; cta: string };
    hasDishes: { subject: string; intro: string; cta: string };
    choosePlan: { subject: string; intro: string; cta: string };
    welcome: { subject: string; intro: string; steps: string[]; cta: string; billingNote: string };
    nudge: { subject: string; intro: string; cta: string };
  }
> = {
  en: {
    greeting: "Hi {name},",
    signoff: "See you soon,",
    team: "The MENUO team",
    questions: "Any questions? Just reply to this email — a real person will answer.",
    translations: "The translations into 20 languages are automatic: you write the menu once, in your own language.",
    dateLocale: "en-GB",
    empty: {
      subject: "Your MENUO menu is 5 minutes away",
      intro: "Thanks for creating <strong>{restaurant}</strong> on MENUO! Your menu is still empty — here's how to have it live today:",
      steps: [
        "Create a section (e.g. Starters, Pizzas, Drinks).",
        "Add your dishes: name, price, photo and the 14 EU allergens.",
        "Start the 14-day free trial and publish your QR code.",
      ],
      cta: "Build my menu",
    },
    hasDishes: {
      subject: "Your menu is ready to go live",
      intro: "Great start with <strong>{restaurant}</strong> — your menu already has {count} dishes! Start your 14-day free trial to publish it and get your QR code. Nothing is charged for 14 days and you can cancel anytime.",
      cta: "Publish my menu",
    },
    choosePlan: {
      subject: "One step left to activate MENUO",
      intro: "Your <strong>{restaurant}</strong> account is created, but it isn't active yet. Choose a plan and add your card to start the 14-day free trial — nothing is charged today, and you can cancel anytime before it ends.",
      cta: "Choose my plan",
    },
    welcome: {
      subject: "Your 14-day free trial has started",
      intro: "Welcome to MENUO! Your free trial for <strong>{restaurant}</strong> is active until <strong>{date}</strong>. The best way to use it: get your menu live this week and see guests read it in their own language.",
      steps: [
        "Send a photo of your current menu (MENUO fills it in for you) or create your sections (e.g. Starters, Pizzas, Drinks).",
        "Add your dishes: name, price, photo and the 14 EU allergens.",
        "Publish and print your QR code — your table card is ready to download.",
      ],
      cta: "Build my menu",
      billingNote: "Nothing is charged before {date}. You can change plan or cancel anytime from Billing.",
    },
    nudge: {
      subject: "{days} days left in your trial — your menu is still empty",
      intro: "Your free trial for <strong>{restaurant}</strong> ends on <strong>{date}</strong>, and your menu doesn't have any dishes yet. Adding the first ones takes about 5 minutes — a few starters and drinks are a good start; you can fill in the rest later.",
      cta: "Add my first dishes",
    },
  },
  pt: {
    greeting: "Olá {name},",
    signoff: "Até breve,",
    team: "A equipa MENUO",
    questions: "Alguma dúvida? Basta responder a este e-mail — quem responde é uma pessoa.",
    translations: "As traduções para 20 idiomas são automáticas: escreve o menu uma vez, no seu idioma.",
    dateLocale: "pt-PT",
    empty: {
      subject: "O seu menu MENUO está a 5 minutos de ficar pronto",
      intro: "Obrigado por criar <strong>{restaurant}</strong> no MENUO! O seu menu ainda está vazio — veja como o pôr online hoje:",
      steps: [
        "Crie uma secção (ex.: Entradas, Pratos principais, Bebidas).",
        "Adicione os pratos: nome, preço, fotografia e os 14 alergénios da UE.",
        "Comece o teste grátis de 14 dias e publique o seu código QR.",
      ],
      cta: "Criar o meu menu",
    },
    hasDishes: {
      subject: "O seu menu está pronto para ficar online",
      intro: "Bom começo com <strong>{restaurant}</strong> — o seu menu já tem {count} pratos! Comece o teste grátis de 14 dias para o publicar e obter o seu código QR. Nada é cobrado durante 14 dias e pode cancelar quando quiser.",
      cta: "Publicar o meu menu",
    },
    choosePlan: {
      subject: "Falta um passo para ativar o MENUO",
      intro: "A conta de <strong>{restaurant}</strong> está criada, mas ainda não está ativa. Escolha um plano e adicione o seu cartão para começar o teste grátis de 14 dias — hoje não é cobrado nada e pode cancelar a qualquer momento antes do fim.",
      cta: "Escolher o meu plano",
    },
    welcome: {
      subject: "O seu teste grátis de 14 dias começou",
      intro: "Damos-lhe as boas-vindas ao MENUO! O teste grátis de <strong>{restaurant}</strong> está ativo até <strong>{date}</strong>. A melhor forma de o aproveitar: ponha o menu online esta semana e veja os clientes a lê-lo no próprio idioma.",
      steps: [
        "Envie uma fotografia do seu menu atual (o MENUO preenche-o por si) ou crie as secções (ex.: Entradas, Pratos principais, Bebidas).",
        "Adicione os pratos: nome, preço, fotografia e os 14 alergénios da UE.",
        "Publique e imprima o código QR — o cartão de mesa fica pronto a descarregar.",
      ],
      cta: "Criar o meu menu",
      billingNote: "Nada é cobrado antes de {date}. Pode mudar de plano ou cancelar a qualquer momento em Subscrição.",
    },
    nudge: {
      subject: "Faltam {days} dias de teste — o seu menu ainda está vazio",
      intro: "O teste grátis de <strong>{restaurant}</strong> termina a <strong>{date}</strong> e o seu menu ainda não tem pratos. Adicionar os primeiros demora cerca de 5 minutos — algumas entradas e bebidas são um bom começo; o resto pode completar depois.",
      cta: "Adicionar os primeiros pratos",
    },
  },
  it: {
    greeting: "Ciao {name},",
    signoff: "A presto,",
    team: "Il team MENUO",
    questions: "Hai domande? Rispondi pure a questa e-mail: ti risponde una persona vera.",
    translations: "Le traduzioni in 20 lingue sono automatiche: scrivi il menu una sola volta, nella tua lingua.",
    dateLocale: "it-IT",
    empty: {
      subject: "Mancano 5 minuti al tuo menu MENUO",
      intro: "Grazie per aver creato <strong>{restaurant}</strong> su MENUO! Il tuo menu è ancora vuoto: ecco come metterlo online oggi stesso:",
      steps: [
        "Crea una sezione (es.: Antipasti, Pizze, Bevande).",
        "Aggiungi i piatti: nome, prezzo, foto e i 14 allergeni UE.",
        "Inizia la prova gratuita di 14 giorni e pubblica il tuo codice QR.",
      ],
      cta: "Crea il mio menu",
    },
    hasDishes: {
      subject: "Il tuo menu è pronto per andare online",
      intro: "Ottimo inizio con <strong>{restaurant}</strong>: il tuo menu ha già {count} piatti! Inizia la prova gratuita di 14 giorni per pubblicarlo e ottenere il tuo codice QR. Nessun addebito per 14 giorni e disdici quando vuoi.",
      cta: "Pubblica il mio menu",
    },
    choosePlan: {
      subject: "Manca un passo per attivare MENUO",
      intro: "L'account di <strong>{restaurant}</strong> è stato creato, ma non è ancora attivo. Scegli un piano e aggiungi la tua carta per iniziare la prova gratuita di 14 giorni: oggi non paghi nulla e puoi disdire in qualsiasi momento prima della fine.",
      cta: "Scegli il mio piano",
    },
    welcome: {
      subject: "La tua prova gratuita di 14 giorni è iniziata",
      intro: "Ti diamo il benvenuto su MENUO! La prova gratuita di <strong>{restaurant}</strong> è attiva fino al <strong>{date}</strong>. Il modo migliore per sfruttarla: metti online il menu questa settimana e guarda i clienti leggerlo nella loro lingua.",
      steps: [
        "Invia una foto del tuo menu attuale (MENUO lo compila per te) oppure crea le sezioni (es.: Antipasti, Pizze, Bevande).",
        "Aggiungi i piatti: nome, prezzo, foto e i 14 allergeni UE.",
        "Pubblica e stampa il codice QR: il segnatavolo è pronto da scaricare.",
      ],
      cta: "Crea il mio menu",
      billingNote: "Nessun addebito prima del {date}. Puoi cambiare piano o disdire in qualsiasi momento da Abbonamento.",
    },
    nudge: {
      subject: "Mancano {days} giorni alla fine della prova: il tuo menu è ancora vuoto",
      intro: "La prova gratuita di <strong>{restaurant}</strong> termina il <strong>{date}</strong> e il tuo menu non ha ancora nessun piatto. Per aggiungere i primi bastano circa 5 minuti: qualche antipasto e le bevande sono un buon inizio, il resto puoi completarlo dopo.",
      cta: "Aggiungi i primi piatti",
    },
  },
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function firstName(name: string): string {
  let first = name.trim().split(/\s+/)[0] || name;
  // Signups typed in all caps ("SARTANELLA") read as shouting in a greeting.
  if (first.length > 1 && first === first.toUpperCase()) first = first[0] + first.slice(1).toLowerCase();
  return escapeHtml(first);
}

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(date);
}

const P = 'style="color:#333; line-height:1.6; margin:0 0 16px;"';

function layout(
  t: Common,
  name: string,
  { intro, steps, extra, cta, url }: { intro: string; steps?: string[]; extra?: string[]; cta: string; url: string }
): string {
  const list = steps
    ? `<ol style="color:#333; line-height:1.7; margin:0 0 16px; padding-left:20px;">${steps.map((s) => `<li>${s}</li>`).join("")}</ol>`
    : "";
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 520px; margin: 0 auto; padding: 8px;">
      <p ${P}>${t.greeting.replace("{name}", firstName(name))}</p>
      <p ${P}>${intro}</p>
      ${list}
      ${(extra ?? []).map((e) => `<p ${P}>${e}</p>`).join("")}
      <p style="margin: 28px 0;">
        <a href="${url}" style="display:inline-block;background:#ffb020;color:#0b2d5b;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">
          ${cta}
        </a>
      </p>
      <p ${P}>${t.questions}</p>
      <p style="color:#333; line-height:1.6; margin:0;">${t.signoff}<br />${t.team}</p>
    </div>
  `;
}

export function buildOnboardingEmail({
  menuLanguage,
  name,
  restaurant,
  dishCount,
  cardRequired = false,
  dashboardUrl,
  billingUrl,
}: {
  menuLanguage: string | null | undefined;
  name: string;
  restaurant: string;
  dishCount: number;
  /** Card-required account without a plan: point at checkout instead. */
  cardRequired?: boolean;
  dashboardUrl: string;
  billingUrl: string;
}): { subject: string; html: string } {
  const t = TEXT[builderLocale(menuLanguage)];
  const stage: Stage = cardRequired ? "choosePlan" : dishCount > 0 ? "hasDishes" : "empty";
  const intro = t[stage].intro
    .replace("{restaurant}", escapeHtml(restaurant.trim()))
    .replace("{count}", String(dishCount));
  const html = layout(t, name, {
    intro,
    steps: stage === "empty" ? t.empty.steps : undefined,
    extra: [t.translations],
    cta: t[stage].cta,
    url: stage === "choosePlan" ? billingUrl : dashboardUrl,
  });
  return { subject: t[stage].subject, html };
}

export function buildTrialWelcomeEmail({
  menuLanguage,
  name,
  restaurant,
  trialEnd,
  dashboardUrl,
}: {
  menuLanguage: string | null | undefined;
  name: string;
  restaurant: string;
  trialEnd: Date;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const t = TEXT[builderLocale(menuLanguage)];
  const date = formatDate(trialEnd, t.dateLocale);
  const html = layout(t, name, {
    intro: t.welcome.intro.replace("{restaurant}", escapeHtml(restaurant.trim())).replace("{date}", date),
    steps: t.welcome.steps,
    extra: [t.translations, t.welcome.billingNote.replace("{date}", date)],
    cta: t.welcome.cta,
    url: dashboardUrl,
  });
  return { subject: t.welcome.subject, html };
}

export function buildTrialNudgeEmail({
  menuLanguage,
  name,
  restaurant,
  trialEnd,
  dashboardUrl,
}: {
  menuLanguage: string | null | undefined;
  name: string;
  restaurant: string;
  trialEnd: Date;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const t = TEXT[builderLocale(menuLanguage)];
  const days = Math.max(1, Math.ceil((trialEnd.getTime() - Date.now()) / 86_400_000));
  const html = layout(t, name, {
    intro: t.nudge.intro
      .replace("{restaurant}", escapeHtml(restaurant.trim()))
      .replace("{date}", formatDate(trialEnd, t.dateLocale)),
    extra: [t.translations],
    cta: t.nudge.cta,
    url: dashboardUrl,
  });
  return { subject: t.nudge.subject.replace("{days}", String(days)), html };
}
