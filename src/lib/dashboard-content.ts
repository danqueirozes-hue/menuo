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
  publish: {
    title: string;
    chooseMenu: string;
    noMenu: string;
    createFirst: string;
    /** "{name}" is replaced with the menu name. */
    intro: string;
    paidPlan: string;
    subscribe: string;
    draftNote: string;
    publishing: string;
    publishCta: string;
    isLive: string;
    /** "{name}" is replaced with the restaurant name. */
    cardAria: string;
    cardNote: string;
    downloadCard: string;
    publicLink: string;
    copyLink: string;
    translationsTitle: string;
    translationsHint: string;
    updating: string;
    updateTranslations: string;
    translationsUpdated: string;
    translateSnag: string;
    progress: string;
    printTitle: string;
    printHint: string;
    generating: string;
    downloadPdf: string;
    pdfError: string;
    unpublishing: string;
    unpublish: string;
    genericError: string;
  };
  settings: {
    title: string;
    subtitle: string;
    name: string;
    logo: string;
    uploading: string;
    address: string;
    city: string;
    country: string;
    currency: string;
    accent: string;
    saving: string;
    save: string;
    saved: string;
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
    publish: {
      title: "Publish & QR code",
      chooseMenu: "Choose which menu to publish and get its QR code.",
      noMenu: "You don't have a menu yet.",
      createFirst: "Create your first menu",
      intro: "Publishing translates “{name}” into 20 languages and makes it available at the link and QR code below.",
      paidPlan: "Publishing is part of a paid plan.",
      subscribe: "Subscribe to go live",
      draftNote: "Your menu is currently a draft — only visible to you. Publish it to generate your QR code and make it live for guests.",
      publishing: "Publishing…",
      publishCta: "Publish menu",
      isLive: "Your menu is live",
      cardAria: "Table card with QR code for {name}",
      cardNote: "A print-ready table card — not just the raw QR code.",
      downloadCard: "Download table card",
      publicLink: "Public menu link",
      copyLink: "Copy link",
      translationsTitle: "Menu translations",
      translationsHint: "Use “Update translations” after editing a dish, adding a translation provider, or changing your menu — it fills in whatever is missing without taking your menu offline.",
      updating: "Updating…",
      updateTranslations: "Update translations",
      translationsUpdated: "Translations updated.",
      translateSnag: "Translating hit a snag. Click “Update translations” to pick up where it left off.",
      progress: "Bringing your menu to the table…",
      printTitle: "Print menu / PDF",
      printHint: "Choose a language and download a print-ready PDF — handy for printing physical menus or emailing to guests.",
      generating: "Generating…",
      downloadPdf: "Download PDF",
      pdfError: "Could not generate the PDF. Please try again.",
      unpublishing: "Unpublishing…",
      unpublish: "Unpublish menu",
      genericError: "Something went wrong. Please try again.",
    },
    settings: {
      title: "Restaurant settings",
      subtitle: "This information appears on every menu published under this establishment.",
      name: "Restaurant name",
      logo: "Logo",
      uploading: "Uploading…",
      address: "Address",
      city: "City",
      country: "Country",
      currency: "Currency (ISO code)",
      accent: "Accent color",
      saving: "Saving…",
      save: "Save changes",
      saved: "Saved",
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
    publish: {
      title: "Publicar e código QR",
      chooseMenu: "Escolha o menu a publicar e obtenha o respetivo código QR.",
      noMenu: "Ainda não tem nenhum menu.",
      createFirst: "Crie o seu primeiro menu",
      intro: "Ao publicar, «{name}» é traduzido para 20 idiomas e fica disponível no link e no código QR abaixo.",
      paidPlan: "A publicação faz parte de um plano pago.",
      subscribe: "Subscreva um plano para ficar online",
      draftNote: "O seu menu ainda é um rascunho, visível apenas para si. Publique-o para gerar o código QR e disponibilizá-lo aos clientes.",
      publishing: "A publicar…",
      publishCta: "Publicar menu",
      isLive: "O seu menu está online",
      cardAria: "Cartão de mesa com o código QR de {name}",
      cardNote: "Um cartão de mesa pronto a imprimir — não apenas o código QR.",
      downloadCard: "Descarregar cartão de mesa",
      publicLink: "Link público do menu",
      copyLink: "Copiar link",
      translationsTitle: "Traduções do menu",
      translationsHint: "Use «Atualizar traduções» depois de editar um prato ou alterar o menu — completa o que faltar sem colocar o menu offline.",
      updating: "A atualizar…",
      updateTranslations: "Atualizar traduções",
      translationsUpdated: "Traduções atualizadas.",
      translateSnag: "A tradução foi interrompida. Clique em «Atualizar traduções» para continuar de onde parou.",
      progress: "A levar o seu menu à mesa…",
      printTitle: "Imprimir menu / PDF",
      printHint: "Escolha um idioma e descarregue um PDF pronto a imprimir — útil para menus em papel ou para enviar por e-mail aos clientes.",
      generating: "A gerar…",
      downloadPdf: "Descarregar PDF",
      pdfError: "Não foi possível gerar o PDF. Tente novamente.",
      unpublishing: "A anular a publicação…",
      unpublish: "Anular publicação",
      genericError: "Ocorreu um erro. Tente novamente.",
    },
    settings: {
      title: "Definições do restaurante",
      subtitle: "Estas informações aparecem em todos os menus publicados por este estabelecimento.",
      name: "Nome do restaurante",
      logo: "Logótipo",
      uploading: "A carregar…",
      address: "Morada",
      city: "Cidade",
      country: "País",
      currency: "Moeda (código ISO)",
      accent: "Cor de destaque",
      saving: "A guardar…",
      save: "Guardar alterações",
      saved: "Guardado",
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
    publish: {
      title: "Pubblica e codice QR",
      chooseMenu: "Scegli quale menu pubblicare e ottieni il suo codice QR.",
      noMenu: "Non hai ancora nessun menu.",
      createFirst: "Crea il tuo primo menu",
      intro: "Pubblicando, «{name}» viene tradotto in 20 lingue e reso disponibile al link e al codice QR qui sotto.",
      paidPlan: "La pubblicazione è inclusa nei piani a pagamento.",
      subscribe: "Abbonati per andare online",
      draftNote: "Il tuo menu è ancora una bozza, visibile solo a te. Pubblicalo per generare il codice QR e renderlo disponibile ai clienti.",
      publishing: "Pubblicazione…",
      publishCta: "Pubblica menu",
      isLive: "Il tuo menu è online",
      cardAria: "Segnatavolo con il codice QR di {name}",
      cardNote: "Un segnatavolo pronto da stampare, non solo il codice QR.",
      downloadCard: "Scarica il segnatavolo",
      publicLink: "Link pubblico del menu",
      copyLink: "Copia link",
      translationsTitle: "Traduzioni del menu",
      translationsHint: "Usa «Aggiorna traduzioni» dopo aver modificato un piatto o il menu: completa ciò che manca senza mettere offline il menu.",
      updating: "Aggiornamento…",
      updateTranslations: "Aggiorna traduzioni",
      translationsUpdated: "Traduzioni aggiornate.",
      translateSnag: "La traduzione si è interrotta. Fai clic su «Aggiorna traduzioni» per riprendere da dove si era fermata.",
      progress: "Stiamo portando il tuo menu in tavola…",
      printTitle: "Stampa menu / PDF",
      printHint: "Scegli una lingua e scarica un PDF pronto per la stampa: utile per i menu cartacei o da inviare via e-mail ai clienti.",
      generating: "Generazione…",
      downloadPdf: "Scarica PDF",
      pdfError: "Impossibile generare il PDF. Riprova.",
      unpublishing: "Annullamento…",
      unpublish: "Annulla pubblicazione",
      genericError: "Si è verificato un errore. Riprova.",
    },
    settings: {
      title: "Impostazioni del ristorante",
      subtitle: "Queste informazioni compaiono in tutti i menu pubblicati da questo locale.",
      name: "Nome del ristorante",
      logo: "Logo",
      uploading: "Caricamento…",
      address: "Indirizzo",
      city: "Città",
      country: "Paese",
      currency: "Valuta (codice ISO)",
      accent: "Colore d'accento",
      saving: "Salvataggio…",
      save: "Salva modifiche",
      saved: "Salvato",
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
