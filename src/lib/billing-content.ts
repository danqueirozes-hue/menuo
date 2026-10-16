import { LANDING_CONTENT, LandingDict, SiteLocale } from "@/lib/landing-content";

/** Strings the client-side BillingPlans component needs. Plan taglines,
 * features, price labels and the interval toggle are shared with the
 * landing page's pricing section so both screens always say the same thing. */
export type BillingPlansDict = Pick<
  LandingDict["pricing"],
  "monthly" | "annual" | "annualNote" | "trialNote" | "price" | "plans"
> & {
  /** BCP 47 locale for the "plan ends on" date. */
  dateLocale: string;
  subscribe: string;
  switchPlan: string;
  redirecting: string;
  currentPlan: string;
  endingSoon: string;
  cancel: string;
  cancelling: string;
  resume: string;
  resuming: string;
  cancelConfirm: string;
  activeThroughPrefix: string;
  activeThroughSuffix: string;
  noticeActivated: string;
  noticePaid: string;
  noticeCanceled: string;
  checkoutError: string;
};

type BillingPageDict = {
  title: string;
  back: string;
  usage: (establishments: number, maxEstablishments: number, menus: number, maxMenus: number) => string;
};

type BillingText = Omit<BillingPlansDict, keyof LandingDict["pricing"]> & { page: BillingPageDict };

const BILLING_TEXT: Record<SiteLocale, BillingText> = {
  en: {
    page: {
      title: "Billing",
      back: "← Back to dashboard",
      usage: (e, maxE, m, maxM) =>
        `${e} of ${maxE} establishment${maxE === 1 ? "" : "s"} · ${m} of ${maxM} menus used.`,
    },
    dateLocale: "en-GB",
    subscribe: "Subscribe",
    switchPlan: "Switch plan",
    redirecting: "Redirecting…",
    currentPlan: "Current plan",
    endingSoon: "Ending soon",
    cancel: "Cancel",
    cancelling: "Cancelling…",
    resume: "Resume subscription",
    resuming: "Resuming…",
    cancelConfirm:
      "Cancel your subscription? You'll keep full access until the end of your current billing period — it won't renew after that.",
    activeThroughPrefix: "Your plan stays fully active through",
    activeThroughSuffix: ", then it won't renew.",
    noticeActivated: "Your subscription is now active — you can publish your menus.",
    noticePaid: "Payment received — your subscription is now active.",
    noticeCanceled: "Checkout was canceled — no changes were made.",
    checkoutError: "Could not start checkout.",
  },
  es: {
    page: {
      title: "Suscripción",
      back: "← Volver al panel",
      usage: (e, maxE, m, maxM) =>
        `${e} de ${maxE} establecimiento${maxE === 1 ? "" : "s"} · ${m} de ${maxM} menús usados.`,
    },
    dateLocale: "es-ES",
    subscribe: "Suscribirse",
    switchPlan: "Cambiar de plan",
    redirecting: "Redirigiendo…",
    currentPlan: "Plan actual",
    endingSoon: "Finaliza pronto",
    cancel: "Cancelar",
    cancelling: "Cancelando…",
    resume: "Reactivar suscripción",
    resuming: "Reactivando…",
    cancelConfirm:
      "¿Cancelar tu suscripción? Mantendrás el acceso completo hasta el final del período de facturación actual; después no se renovará.",
    activeThroughPrefix: "Tu plan sigue totalmente activo hasta el",
    activeThroughSuffix: "; después no se renovará.",
    noticeActivated: "Tu suscripción ya está activa: puedes publicar tus menús.",
    noticePaid: "Pago recibido: tu suscripción ya está activa.",
    noticeCanceled: "Se canceló el pago: no se ha realizado ningún cambio.",
    checkoutError: "No se pudo iniciar el pago.",
  },
  pt: {
    page: {
      title: "Subscrição",
      back: "← Voltar ao painel",
      usage: (e, maxE, m, maxM) =>
        `${e} de ${maxE} estabelecimento${maxE === 1 ? "" : "s"} · ${m} de ${maxM} menus utilizados.`,
    },
    dateLocale: "pt-PT",
    subscribe: "Assinar",
    switchPlan: "Mudar de plano",
    redirecting: "A redirecionar…",
    currentPlan: "Plano atual",
    endingSoon: "Termina em breve",
    cancel: "Cancelar",
    cancelling: "A cancelar…",
    resume: "Retomar subscrição",
    resuming: "A retomar…",
    cancelConfirm:
      "Cancelar a sua subscrição? Mantém o acesso completo até ao fim do período de faturação atual; depois disso não será renovada.",
    activeThroughPrefix: "O seu plano continua totalmente ativo até",
    activeThroughSuffix: "; depois disso não será renovado.",
    noticeActivated: "A sua subscrição está ativa: já pode publicar os seus menus.",
    noticePaid: "Pagamento recebido: a sua subscrição está ativa.",
    noticeCanceled: "O pagamento foi cancelado: não foi feita nenhuma alteração.",
    checkoutError: "Não foi possível iniciar o pagamento.",
  },
  it: {
    page: {
      title: "Abbonamento",
      back: "← Torna alla dashboard",
      usage: (e, maxE, m, maxM) => `${e} di ${maxE} local${maxE === 1 ? "e" : "i"} · ${m} di ${maxM} menu utilizzati.`,
    },
    dateLocale: "it-IT",
    subscribe: "Abbonati",
    switchPlan: "Cambia piano",
    redirecting: "Reindirizzamento…",
    currentPlan: "Piano attuale",
    endingSoon: "In scadenza",
    cancel: "Annulla",
    cancelling: "Annullamento…",
    resume: "Riattiva abbonamento",
    resuming: "Riattivazione…",
    cancelConfirm:
      "Annullare l'abbonamento? Manterrai l'accesso completo fino alla fine del periodo di fatturazione in corso; dopo non verrà rinnovato.",
    activeThroughPrefix: "Il tuo piano resta pienamente attivo fino al",
    activeThroughSuffix: ", poi non verrà rinnovato.",
    noticeActivated: "Il tuo abbonamento è attivo: puoi pubblicare i tuoi menu.",
    noticePaid: "Pagamento ricevuto: il tuo abbonamento è attivo.",
    noticeCanceled: "Pagamento annullato: non è stata apportata alcuna modifica.",
    checkoutError: "Impossibile avviare il pagamento.",
  },
  de: {
    page: {
      title: "Abonnement",
      back: "← Zurück zum Dashboard",
      usage: (e, maxE, m, maxM) => `${e} von ${maxE} Betrieb${maxE === 1 ? "" : "en"} · ${m} von ${maxM} Speisekarten genutzt.`,
    },
    dateLocale: "de-DE",
    subscribe: "Abonnieren",
    switchPlan: "Plan wechseln",
    redirecting: "Weiterleitung…",
    currentPlan: "Aktueller Plan",
    endingSoon: "Endet bald",
    cancel: "Kündigen",
    cancelling: "Wird gekündigt…",
    resume: "Abo fortsetzen",
    resuming: "Wird fortgesetzt…",
    cancelConfirm:
      "Abonnement kündigen? Sie behalten vollen Zugriff bis zum Ende des aktuellen Abrechnungszeitraums; danach wird es nicht verlängert.",
    activeThroughPrefix: "Ihr Plan bleibt vollständig aktiv bis zum",
    activeThroughSuffix: " und wird danach nicht verlängert.",
    noticeActivated: "Ihr Abonnement ist jetzt aktiv: Sie können Ihre Speisekarten veröffentlichen.",
    noticePaid: "Zahlung erhalten: Ihr Abonnement ist jetzt aktiv.",
    noticeCanceled: "Der Bezahlvorgang wurde abgebrochen: Es wurde nichts geändert.",
    checkoutError: "Der Bezahlvorgang konnte nicht gestartet werden.",
  },
  fr: {
    page: {
      title: "Abonnement",
      back: "← Retour au tableau de bord",
      usage: (e, maxE, m, maxM) =>
        `${e} sur ${maxE} établissement${maxE === 1 ? "" : "s"} · ${m} sur ${maxM} menus utilisés.`,
    },
    dateLocale: "fr-FR",
    subscribe: "S'abonner",
    switchPlan: "Changer de formule",
    redirecting: "Redirection…",
    currentPlan: "Formule actuelle",
    endingSoon: "Se termine bientôt",
    cancel: "Résilier",
    cancelling: "Résiliation…",
    resume: "Réactiver l'abonnement",
    resuming: "Réactivation…",
    cancelConfirm:
      "Résilier votre abonnement ? Vous gardez un accès complet jusqu'à la fin de la période de facturation en cours ; il ne sera pas renouvelé ensuite.",
    activeThroughPrefix: "Votre formule reste pleinement active jusqu'au",
    activeThroughSuffix: ", puis elle ne sera pas renouvelée.",
    noticeActivated: "Votre abonnement est actif : vous pouvez publier vos menus.",
    noticePaid: "Paiement reçu : votre abonnement est actif.",
    noticeCanceled: "Le paiement a été annulé : aucune modification n'a été effectuée.",
    checkoutError: "Impossible de lancer le paiement.",
  },
};

export function getBillingContent(locale: SiteLocale): { page: BillingPageDict; plans: BillingPlansDict } {
  const { page, ...text } = BILLING_TEXT[locale];
  const { monthly, annual, annualNote, trialNote, price, plans } = LANDING_CONTENT[locale].pricing;
  return { page, plans: { monthly, annual, annualNote, trialNote, price, plans, ...text } };
}
