import { BuilderLocale, builderLocale, localizedLanguageOptions } from "@/lib/builder-content";

/** UI strings for the establishment dashboard shell (sidebar, menus list).
 * Like the menu builder, it follows the language the establishment's menu is
 * written in: Portuguese (PT-PT) and Italian have their own copy, every other
 * language uses English.
 * Plain strings only (with {placeholders}) because parts of this dict cross
 * the server → client component boundary. */
export type OnboardingStep = "section" | "dish" | "trial" | "publish";

export type DashboardDict = {
  nav: {
    menus: string;
    publish: string;
    settings: string;
    billing: string;
    /** "{plan}" is replaced with the plan name. */
    activePlan: string;
    activeFallback: string;
    noPlan: string;
    logout: string;
    openMenu: string;
    closeMenu: string;
    addEstablishment: string;
    upgradeEstablishments: string;
  };
  menus: {
    /** "{name}" is replaced with the establishment name. */
    title: string;
    /** "{used}" / "{max}" are replaced with menu counts. */
    usedOne: string;
    usedOther: string;
    live: string;
    draft: string;
    publish: string;
    limitReached: string;
    upgradeMenus: string;
    rename: string;
    saving: string;
    duplicate: string;
    duplicating: string;
    duplicateTitle: string;
    duplicateDisabledTitle: string;
    duplicateError: string;
    delete: string;
    deleting: string;
    deleteTitle: string;
    /** "{name}" is replaced with the menu name. */
    deleteConfirm: string;
  };
  newMenu: {
    cta: string;
    name: string;
    namePlaceholder: string;
    language: string;
    selectLanguage: string;
    languageOptions: { code: string; label: string }[];
    creating: string;
    create: string;
    cancel: string;
    error: string;
  };
  /** First-run checklist on the menus page. "{done}" = completed steps. */
  onboarding: {
    title: string;
    subtitle: string;
    progress: string;
    done: string;
    steps: Record<OnboardingStep, { title: string; hint: string; cta: string }>;
  };
  contact: {
    email: string;
    instagram: string;
    help: string;
    supportSubject: string;
  };
};

const TEXT: Record<BuilderLocale, Omit<DashboardDict, "newMenu"> & { newMenu: Omit<DashboardDict["newMenu"], "languageOptions"> }> = {
  en: {
    nav: {
      menus: "Menus",
      publish: "Publish & QR code",
      settings: "Establishment settings",
      billing: "Billing",
      activePlan: "{plan} plan",
      activeFallback: "Active plan",
      noPlan: "No active plan",
      logout: "Log out",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      addEstablishment: "Add establishment",
      upgradeEstablishments: "Upgrade to add more establishments",
    },
    menus: {
      title: "{name} — Menus",
      usedOne: "{used} of {max} menu used on your current plan.",
      usedOther: "{used} of {max} menus used on your current plan.",
      live: "Live",
      draft: "Draft",
      publish: "Publish",
      limitReached: "You've reached the menu limit for your current plan.",
      upgradeMenus: "Upgrade to add more menus",
      rename: "Rename menu",
      saving: "Saving…",
      duplicate: "Duplicate",
      duplicating: "Duplicating…",
      duplicateTitle: "Duplicate this menu",
      duplicateDisabledTitle: "Upgrade your plan to duplicate menus",
      duplicateError: "Could not duplicate the menu.",
      delete: "Delete",
      deleting: "Deleting…",
      deleteTitle: "Delete menu",
      deleteConfirm:
        'Delete "{name}"? This permanently removes its sections, dishes and QR code. This cannot be undone.',
    },
    newMenu: {
      cta: "+ New menu",
      name: "Menu name",
      namePlaceholder: "Lunch Menu",
      language: "Language it's written in",
      selectLanguage: "Select a language",
      creating: "Creating…",
      create: "Create menu",
      cancel: "Cancel",
      error: "Could not create the menu.",
    },
    onboarding: {
      title: "Get your menu live in 4 steps",
      subtitle: "It takes about 5 minutes — the translations into 20 languages are automatic.",
      progress: "{done} of 4",
      done: "Done",
      steps: {
        section: { title: "Create your first section", hint: "e.g. Starters, Pizzas, Drinks", cta: "Create section" },
        dish: { title: "Add your dishes", hint: "Name, description, price, photo and the 14 EU allergens.", cta: "Add dishes" },
        trial: { title: "Start your 14-day free trial", hint: "Nothing is charged for 14 days. Cancel anytime.", cta: "Start free trial" },
        publish: { title: "Publish and print your QR code", hint: "Guests scan it and read the menu in their own language.", cta: "Publish menu" },
      },
    },
    contact: { email: "Email us", instagram: "MENUO on Instagram", help: "Help", supportSubject: "MENUO Support" },
  },
  pt: {
    nav: {
      menus: "Menus",
      publish: "Publicar e código QR",
      settings: "Definições do estabelecimento",
      billing: "Faturação",
      activePlan: "Plano {plan}",
      activeFallback: "Plano ativo",
      noPlan: "Sem plano ativo",
      logout: "Terminar sessão",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      addEstablishment: "Adicionar estabelecimento",
      upgradeEstablishments: "Mude de plano para adicionar mais estabelecimentos",
    },
    menus: {
      title: "{name} — Menus",
      usedOne: "{used} de {max} menu utilizado no seu plano atual.",
      usedOther: "{used} de {max} menus utilizados no seu plano atual.",
      live: "Publicado",
      draft: "Rascunho",
      publish: "Publicar",
      limitReached: "Atingiu o limite de menus do seu plano atual.",
      upgradeMenus: "Mude de plano para adicionar mais menus",
      rename: "Mudar o nome do menu",
      saving: "A guardar…",
      duplicate: "Duplicar",
      duplicating: "A duplicar…",
      duplicateTitle: "Duplicar este menu",
      duplicateDisabledTitle: "Mude de plano para duplicar menus",
      duplicateError: "Não foi possível duplicar o menu.",
      delete: "Eliminar",
      deleting: "A eliminar…",
      deleteTitle: "Eliminar menu",
      deleteConfirm:
        "Eliminar «{name}»? Esta ação remove definitivamente as secções, os pratos e o código QR. Não pode ser anulada.",
    },
    newMenu: {
      cta: "+ Novo menu",
      name: "Nome do menu",
      namePlaceholder: "Menu de almoço",
      language: "Idioma em que está escrito",
      selectLanguage: "Selecione um idioma",
      creating: "A criar…",
      create: "Criar menu",
      cancel: "Cancelar",
      error: "Não foi possível criar o menu.",
    },
    onboarding: {
      title: "Coloque o seu menu online em 4 passos",
      subtitle: "Demora cerca de 5 minutos — as traduções para 20 idiomas são automáticas.",
      progress: "{done} de 4",
      done: "Concluído",
      steps: {
        section: { title: "Crie a primeira secção", hint: "ex.: Entradas, Pratos principais, Bebidas", cta: "Criar secção" },
        dish: { title: "Adicione os seus pratos", hint: "Nome, descrição, preço, fotografia e os 14 alergénios da UE.", cta: "Adicionar pratos" },
        trial: { title: "Comece o teste grátis de 14 dias", hint: "Nada é cobrado durante 14 dias. Cancele quando quiser.", cta: "Começar teste grátis" },
        publish: { title: "Publique e imprima o seu código QR", hint: "Os clientes leem o código e veem o menu no próprio idioma.", cta: "Publicar menu" },
      },
    },
    contact: { email: "Enviar e-mail", instagram: "MENUO no Instagram", help: "Ajuda", supportSubject: "Suporte MENUO" },
  },
  it: {
    nav: {
      menus: "Menu",
      publish: "Pubblica e codice QR",
      settings: "Impostazioni del locale",
      billing: "Abbonamento",
      activePlan: "Piano {plan}",
      activeFallback: "Piano attivo",
      noPlan: "Nessun piano attivo",
      logout: "Esci",
      openMenu: "Apri menu",
      closeMenu: "Chiudi menu",
      addEstablishment: "Aggiungi locale",
      upgradeEstablishments: "Passa a un piano superiore per aggiungere altri locali",
    },
    menus: {
      title: "{name} — Menu",
      usedOne: "{used} di {max} menu utilizzato con il tuo piano attuale.",
      usedOther: "{used} di {max} menu utilizzati con il tuo piano attuale.",
      live: "Online",
      draft: "Bozza",
      publish: "Pubblica",
      limitReached: "Hai raggiunto il limite di menu del tuo piano attuale.",
      upgradeMenus: "Passa a un piano superiore per aggiungere altri menu",
      rename: "Rinomina menu",
      saving: "Salvataggio…",
      duplicate: "Duplica",
      duplicating: "Duplicazione…",
      duplicateTitle: "Duplica questo menu",
      duplicateDisabledTitle: "Passa a un piano superiore per duplicare i menu",
      duplicateError: "Impossibile duplicare il menu.",
      delete: "Elimina",
      deleting: "Eliminazione…",
      deleteTitle: "Elimina menu",
      deleteConfirm:
        "Eliminare «{name}»? Verranno rimossi definitivamente sezioni, piatti e codice QR. L'operazione non può essere annullata.",
    },
    newMenu: {
      cta: "+ Nuovo menu",
      name: "Nome del menu",
      namePlaceholder: "Menu pranzo",
      language: "Lingua in cui è scritto",
      selectLanguage: "Seleziona una lingua",
      creating: "Creazione…",
      create: "Crea menu",
      cancel: "Annulla",
      error: "Impossibile creare il menu.",
    },
    onboarding: {
      title: "Metti online il tuo menu in 4 passi",
      subtitle: "Ci vogliono circa 5 minuti: le traduzioni in 20 lingue sono automatiche.",
      progress: "{done} di 4",
      done: "Fatto",
      steps: {
        section: { title: "Crea la prima sezione", hint: "es.: Antipasti, Pizze, Bevande", cta: "Crea sezione" },
        dish: { title: "Aggiungi i tuoi piatti", hint: "Nome, descrizione, prezzo, foto e i 14 allergeni UE.", cta: "Aggiungi piatti" },
        trial: { title: "Inizia la prova gratuita di 14 giorni", hint: "Nessun addebito per 14 giorni. Disdici quando vuoi.", cta: "Inizia la prova gratuita" },
        publish: { title: "Pubblica e stampa il tuo codice QR", hint: "I clienti lo inquadrano e leggono il menu nella loro lingua.", cta: "Pubblica menu" },
      },
    },
    contact: { email: "Scrivici", instagram: "MENUO su Instagram", help: "Aiuto", supportSubject: "Assistenza MENUO" },
  },
};

/** `menuLanguage` is the source language of the establishment's first menu. */
export function getDashboardContent(menuLanguage: string | null | undefined): DashboardDict {
  const locale = builderLocale(menuLanguage);
  const text = TEXT[locale];
  return { ...text, newMenu: { ...text.newMenu, languageOptions: localizedLanguageOptions(locale) } };
}
