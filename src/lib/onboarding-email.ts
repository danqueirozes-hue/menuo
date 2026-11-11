import { builderLocale, BuilderLocale } from "@/lib/builder-content";

/** "Finish setting up your menu" nudge, sent a few hours after signup to
 * accounts that haven't published yet. Same language rule as the dashboard:
 * the first menu's source language picks PT-PT / Italian, else English. */

type Stage = "empty" | "hasDishes";

const TEXT: Record<
  BuilderLocale,
  {
    greeting: string;
    signoff: string;
    team: string;
    questions: string;
    translations: string;
    empty: { subject: string; intro: string; steps: string[]; cta: string };
    hasDishes: { subject: string; intro: string; cta: string };
  }
> = {
  en: {
    greeting: "Hi {name},",
    signoff: "See you soon,",
    team: "The MENUO team",
    questions: "Any questions? Just reply to this email — a real person will answer.",
    translations: "The translations into 20 languages are automatic: you write the menu once, in your own language.",
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
  },
  pt: {
    greeting: "Olá {name},",
    signoff: "Até breve,",
    team: "A equipa MENUO",
    questions: "Alguma dúvida? Basta responder a este e-mail — quem responde é uma pessoa.",
    translations: "As traduções para 20 idiomas são automáticas: escreve o menu uma vez, no seu idioma.",
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
  },
  it: {
    greeting: "Ciao {name},",
    signoff: "A presto,",
    team: "Il team MENUO",
    questions: "Hai domande? Rispondi pure a questa e-mail: ti risponde una persona vera.",
    translations: "Le traduzioni in 20 lingue sono automatiche: scrivi il menu una sola volta, nella tua lingua.",
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
  },
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function buildOnboardingEmail({
  menuLanguage,
  name,
  restaurant,
  dishCount,
  dashboardUrl,
}: {
  menuLanguage: string | null | undefined;
  name: string;
  restaurant: string;
  dishCount: number;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const t = TEXT[builderLocale(menuLanguage)];
  const stage: Stage = dishCount > 0 ? "hasDishes" : "empty";
  let first = name.trim().split(/\s+/)[0] || name;
  // Signups typed in all caps ("SARTANELLA") read as shouting in a greeting.
  if (first.length > 1 && first === first.toUpperCase()) first = first[0] + first.slice(1).toLowerCase();
  const firstName = escapeHtml(first);
  const intro = t[stage].intro.replace("{restaurant}", escapeHtml(restaurant.trim())).replace("{count}", String(dishCount));
  const p = 'style="color:#333; line-height:1.6; margin:0 0 16px;"';

  const steps =
    stage === "empty"
      ? `<ol style="color:#333; line-height:1.7; margin:0 0 16px; padding-left:20px;">${t.empty.steps
          .map((s) => `<li>${s}</li>`)
          .join("")}</ol>`
      : "";

  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 520px; margin: 0 auto; padding: 8px;">
      <p ${p}>${t.greeting.replace("{name}", firstName)}</p>
      <p ${p}>${intro}</p>
      ${steps}
      <p ${p}>${t.translations}</p>
      <p style="margin: 28px 0;">
        <a href="${dashboardUrl}" style="display:inline-block;background:#ffb020;color:#0b2d5b;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">
          ${t[stage].cta}
        </a>
      </p>
      <p ${p}>${t.questions}</p>
      <p style="color:#333; line-height:1.6; margin:0;">${t.signoff}<br />${t.team}</p>
    </div>
  `;
  return { subject: t[stage].subject, html };
}
