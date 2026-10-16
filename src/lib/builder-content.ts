import { DIETARY_LABELS, DietaryKey } from "@/lib/dietary-tags";
import { LANGUAGES } from "@/lib/languages";

/** UI strings for the menu builder screen. The builder follows the menu's
 * source language (the language the owner writes the dishes in) — for now
 * only Portuguese (PT-PT) has its own copy; every other language uses English.
 * Plain strings only (with {placeholders}) because this dict crosses the
 * server → client component boundary. */
export type BuilderDict = {
  intro: string;
  publishCta: string;
  republishCta: string;
  sourceLanguage: string;
  /** Language options for the source-language picker, named in the UI language. */
  languageOptions: { code: string; label: string }[];
  sectionSuggestions: string[];
  addSectionTitle: string;
  customSectionPlaceholder: string;
  add: string;
  confirmDeleteSection: string;
  /** "{name}" is replaced with the dish name. */
  confirmDeleteDish: string;
  dragSection: string;
  deleteSection: string;
  noDishes: string;
  addDish: string;
  dragDish: string;
  editDish: string;
  deleteDish: string;
  /** "{count}" is replaced with the number of price options. */
  optionsCount: string;
  dietary: Record<DietaryKey, string>;
  editor: {
    titleEdit: string;
    titleNew: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    dietaryInfo: string;
    hasVariants: string;
    price: string;
    pricePlaceholder: string;
    options: string;
    optionPlaceholder: string;
    optionPricePlaceholder: string;
    removeOption: string;
    addOption: string;
    photo: string;
    photoAlt: string;
    uploading: string;
    cancel: string;
    saving: string;
    save: string;
    errorName: string;
    /** "{min}" is replaced with the minimum number of options. */
    errorOptions: string;
    errorPrice: string;
    errorSave: string;
    errorUpload: string;
  };
};

type BuilderLocale = "en" | "pt";

const TEXT: Record<BuilderLocale, Omit<BuilderDict, "languageOptions" | "dietary">> = {
  en: {
    intro:
      "Add sections and dishes. Changes are saved automatically — publish when you're ready to generate your QR code.",
    publishCta: "Publish this menu",
    republishCta: "Publish & QR code",
    sourceLanguage: "Source language:",
    sectionSuggestions: ["Starters", "First Course", "Main Course", "Dessert", "Beverages"],
    addSectionTitle: "Add a new section",
    customSectionPlaceholder: "Custom section name",
    add: "Add",
    confirmDeleteSection: "Delete this section and all its dishes?",
    confirmDeleteDish: 'Delete "{name}"?',
    dragSection: "Drag to reorder section",
    deleteSection: "Delete section",
    noDishes: "No dishes yet in this section.",
    addDish: "Add a dish",
    dragDish: "Drag to reorder dish",
    editDish: "Edit dish",
    deleteDish: "Delete dish",
    optionsCount: "{count} options",
    editor: {
      titleEdit: "Edit dish",
      titleNew: "Add a dish",
      name: "Dish name",
      namePlaceholder: "Truffle risotto",
      description: "Ingredients / description",
      descriptionPlaceholder: "Arborio rice, black truffle, parmesan, white wine",
      dietaryInfo: "Dietary info",
      hasVariants: "This dish has price variations (e.g. sizes)?",
      price: "Price",
      pricePlaceholder: "18.50",
      options: "Options (2 to 3)",
      optionPlaceholder: "e.g. Individual, Family, Small",
      optionPricePlaceholder: "12.00",
      removeOption: "Remove option",
      addOption: "Add another option",
      photo: "Photo",
      photoAlt: "Dish preview",
      uploading: "Uploading…",
      cancel: "Cancel",
      saving: "Saving…",
      save: "Save dish",
      errorName: "Please provide a dish name.",
      errorOptions: "Add a name and a valid price for at least {min} options.",
      errorPrice: "Please provide a valid price.",
      errorSave: "Could not save the dish.",
      errorUpload: "Upload failed",
    },
  },
  pt: {
    intro:
      "Adicione secções e pratos. As alterações são guardadas automaticamente — publique quando estiver pronto para gerar o seu código QR.",
    publishCta: "Publicar este menu",
    republishCta: "Publicar e código QR",
    sourceLanguage: "Idioma de origem:",
    sectionSuggestions: ["Entradas", "Primeiro prato", "Prato principal", "Sobremesas", "Bebidas"],
    addSectionTitle: "Adicionar uma nova secção",
    customSectionPlaceholder: "Nome personalizado da secção",
    add: "Adicionar",
    confirmDeleteSection: "Eliminar esta secção e todos os seus pratos?",
    confirmDeleteDish: "Eliminar «{name}»?",
    dragSection: "Arraste para reordenar a secção",
    deleteSection: "Eliminar secção",
    noDishes: "Ainda não há pratos nesta secção.",
    addDish: "Adicionar um prato",
    dragDish: "Arraste para reordenar o prato",
    editDish: "Editar prato",
    deleteDish: "Eliminar prato",
    optionsCount: "{count} opções",
    editor: {
      titleEdit: "Editar prato",
      titleNew: "Adicionar um prato",
      name: "Nome do prato",
      namePlaceholder: "Arroz de marisco",
      description: "Ingredientes / descrição",
      descriptionPlaceholder: "Arroz carolino, camarão, amêijoas, coentros, vinho branco",
      dietaryInfo: "Informação alimentar",
      hasVariants: "Este prato tem variações de preço (por exemplo, tamanhos)?",
      price: "Preço",
      pricePlaceholder: "18,50",
      options: "Opções (2 a 3)",
      optionPlaceholder: "ex.: Individual, Família, Meia dose",
      optionPricePlaceholder: "12,00",
      removeOption: "Remover opção",
      addOption: "Adicionar outra opção",
      photo: "Fotografia",
      photoAlt: "Pré-visualização do prato",
      uploading: "A carregar…",
      cancel: "Cancelar",
      saving: "A guardar…",
      save: "Guardar prato",
      errorName: "Indique o nome do prato.",
      errorOptions: "Indique um nome e um preço válido para pelo menos {min} opções.",
      errorPrice: "Indique um preço válido.",
      errorSave: "Não foi possível guardar o prato.",
      errorUpload: "Falha no carregamento",
    },
  },
};

const LANGUAGE_NAME_LOCALE: Record<BuilderLocale, string> = { en: "en", pt: "pt-PT" };

export function getBuilderContent(sourceLanguage: string): BuilderDict {
  const locale: BuilderLocale = sourceLanguage === "pt" ? "pt" : "en";
  const names = new Intl.DisplayNames([LANGUAGE_NAME_LOCALE[locale]], { type: "language" });
  const languageOptions = LANGUAGES.map((l) => {
    const name = locale === "en" ? l.englishName : (names.of(l.code) ?? l.englishName);
    return { code: l.code, label: `${l.flag} ${name.charAt(0).toUpperCase()}${name.slice(1)}` };
  });
  return { ...TEXT[locale], languageOptions, dietary: DIETARY_LABELS[locale] };
}
