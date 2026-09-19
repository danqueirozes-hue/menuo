import { Leaf, Vegan, WheatOff, Fish, type LucideIcon } from "lucide-react";

export type DietaryKey = "isVegetarian" | "isVegan" | "isGlutenFree" | "hasSeafood";

export type DietaryTagDef = {
  key: DietaryKey;
  label: string;
  icon: LucideIcon;
};

export const DIETARY_TAGS: DietaryTagDef[] = [
  { key: "isVegetarian", label: "Vegetarian", icon: Leaf },
  { key: "isVegan", label: "Vegan", icon: Vegan },
  { key: "isGlutenFree", label: "Gluten-free", icon: WheatOff },
  { key: "hasSeafood", label: "Contains seafood", icon: Fish },
];

export type DietaryFlags = Record<DietaryKey, boolean>;

// Short labels shown as a hover/tap tooltip on the public menu icons, in each
// of the 20 supported guest languages. Keep these short — they're a tooltip
// for an already-recognizable icon, not the primary way the info is conveyed.
export const DIETARY_LABELS: Record<string, Record<DietaryKey, string>> = {
  en: { isVegetarian: "Vegetarian", isVegan: "Vegan", isGlutenFree: "Gluten-free", hasSeafood: "Contains seafood" },
  fr: { isVegetarian: "Végétarien", isVegan: "Végan", isGlutenFree: "Sans gluten", hasSeafood: "Contient des fruits de mer" },
  de: { isVegetarian: "Vegetarisch", isVegan: "Vegan", isGlutenFree: "Glutenfrei", hasSeafood: "Enthält Meeresfrüchte" },
  es: { isVegetarian: "Vegetariano", isVegan: "Vegano", isGlutenFree: "Sin gluten", hasSeafood: "Contiene marisco" },
  it: { isVegetarian: "Vegetariano", isVegan: "Vegano", isGlutenFree: "Senza glutine", hasSeafood: "Contiene frutti di mare" },
  pt: { isVegetarian: "Vegetariano", isVegan: "Vegano", isGlutenFree: "Sem glúten", hasSeafood: "Contém frutos do mar" },
  nl: { isVegetarian: "Vegetarisch", isVegan: "Veganistisch", isGlutenFree: "Glutenvrij", hasSeafood: "Bevat schaal- en schelpdieren" },
  pl: { isVegetarian: "Wegetariańskie", isVegan: "Wegańskie", isGlutenFree: "Bezglutenowe", hasSeafood: "Zawiera owoce morza" },
  sv: { isVegetarian: "Vegetariskt", isVegan: "Veganskt", isGlutenFree: "Glutenfritt", hasSeafood: "Innehåller skaldjur" },
  el: { isVegetarian: "Χορτοφαγικό", isVegan: "Vegan", isGlutenFree: "Χωρίς γλουτένη", hasSeafood: "Περιέχει θαλασσινά" },
  ru: { isVegetarian: "Вегетарианское", isVegan: "Веганское", isGlutenFree: "Без глютена", hasSeafood: "Содержит морепродукты" },
  tr: { isVegetarian: "Vejetaryen", isVegan: "Vegan", isGlutenFree: "Glutensiz", hasSeafood: "Deniz ürünü içerir" },
  ar: { isVegetarian: "نباتي", isVegan: "نباتي صرف", isGlutenFree: "خالٍ من الغلوتين", hasSeafood: "يحتوي على مأكولات بحرية" },
  zh: { isVegetarian: "素食", isVegan: "纯素", isGlutenFree: "无麸质", hasSeafood: "含海鲜" },
  ja: { isVegetarian: "ベジタリアン", isVegan: "ヴィーガン", isGlutenFree: "グルテンフリー", hasSeafood: "魚介類を含む" },
  ko: { isVegetarian: "채식", isVegan: "비건", isGlutenFree: "글루텐 프리", hasSeafood: "해산물 포함" },
  hi: { isVegetarian: "शाकाहारी", isVegan: "वीगन", isGlutenFree: "ग्लूटेन-मुक्त", hasSeafood: "समुद्री भोजन शामिल है" },
  th: { isVegetarian: "มังสวิรัติ", isVegan: "วีแกน", isGlutenFree: "ปราศจากกลูเตน", hasSeafood: "มีอาหารทะเล" },
  vi: { isVegetarian: "Chay", isVegan: "Thuần chay", isGlutenFree: "Không chứa gluten", hasSeafood: "Có hải sản" },
  sw: { isVegetarian: "Mboga", isVegan: "Vegan", isGlutenFree: "Bila gluteni", hasSeafood: "Ina dagaa" },
};

export function dietaryLabel(key: DietaryKey, lang: string): string {
  return DIETARY_LABELS[lang]?.[key] ?? DIETARY_LABELS.en[key];
}
