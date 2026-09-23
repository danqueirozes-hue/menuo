import { Leaf, Vegan, WheatOff, Fish, Star, Sparkles, type LucideIcon } from "lucide-react";

export type DietaryKey =
  | "isVegetarian"
  | "isVegan"
  | "isGlutenFree"
  | "hasSeafood"
  | "isSpecialty"
  | "isNew";

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
  { key: "isSpecialty", label: "Chef's special", icon: Star },
  { key: "isNew", label: "New", icon: Sparkles },
];

export type DietaryFlags = Record<DietaryKey, boolean>;

// Short labels shown as a hover/tap tooltip on the public menu icons, in each
// of the 20 supported guest languages. Keep these short — they're a tooltip
// for an already-recognizable icon, not the primary way the info is conveyed.
export const DIETARY_LABELS: Record<string, Record<DietaryKey, string>> = {
  en: { isVegetarian: "Vegetarian", isVegan: "Vegan", isGlutenFree: "Gluten-free", hasSeafood: "Contains seafood", isSpecialty: "Chef's special", isNew: "New" },
  fr: { isVegetarian: "Végétarien", isVegan: "Végan", isGlutenFree: "Sans gluten", hasSeafood: "Contient des fruits de mer", isSpecialty: "Spécialité du chef", isNew: "Nouveau" },
  de: { isVegetarian: "Vegetarisch", isVegan: "Vegan", isGlutenFree: "Glutenfrei", hasSeafood: "Enthält Meeresfrüchte", isSpecialty: "Spezialität des Hauses", isNew: "Neu" },
  es: { isVegetarian: "Vegetariano", isVegan: "Vegano", isGlutenFree: "Sin gluten", hasSeafood: "Contiene marisco", isSpecialty: "Especialidad de la casa", isNew: "Nuevo" },
  it: { isVegetarian: "Vegetariano", isVegan: "Vegano", isGlutenFree: "Senza glutine", hasSeafood: "Contiene frutti di mare", isSpecialty: "Specialità dello chef", isNew: "Novità" },
  pt: { isVegetarian: "Vegetariano", isVegan: "Vegano", isGlutenFree: "Sem glúten", hasSeafood: "Contém frutos do mar", isSpecialty: "Especialidade da casa", isNew: "Novidade" },
  nl: { isVegetarian: "Vegetarisch", isVegan: "Veganistisch", isGlutenFree: "Glutenvrij", hasSeafood: "Bevat schaal- en schelpdieren", isSpecialty: "Specialiteit van de chef", isNew: "Nieuw" },
  pl: { isVegetarian: "Wegetariańskie", isVegan: "Wegańskie", isGlutenFree: "Bezglutenowe", hasSeafood: "Zawiera owoce morza", isSpecialty: "Specjalność szefa kuchni", isNew: "Nowość" },
  sv: { isVegetarian: "Vegetariskt", isVegan: "Veganskt", isGlutenFree: "Glutenfritt", hasSeafood: "Innehåller skaldjur", isSpecialty: "Kockens specialitet", isNew: "Nyhet" },
  el: { isVegetarian: "Χορτοφαγικό", isVegan: "Vegan", isGlutenFree: "Χωρίς γλουτένη", hasSeafood: "Περιέχει θαλασσινά", isSpecialty: "Ειδικότητα του σεφ", isNew: "Νέο" },
  ru: { isVegetarian: "Вегетарианское", isVegan: "Веганское", isGlutenFree: "Без глютена", hasSeafood: "Содержит морепродукты", isSpecialty: "Фирменное блюдо", isNew: "Новинка" },
  tr: { isVegetarian: "Vejetaryen", isVegan: "Vegan", isGlutenFree: "Glutensiz", hasSeafood: "Deniz ürünü içerir", isSpecialty: "Şefin özel yemeği", isNew: "Yeni" },
  ar: { isVegetarian: "نباتي", isVegan: "نباتي صرف", isGlutenFree: "خالٍ من الغلوتين", hasSeafood: "يحتوي على مأكولات بحرية", isSpecialty: "طبق الشيف المميز", isNew: "جديد" },
  zh: { isVegetarian: "素食", isVegan: "纯素", isGlutenFree: "无麸质", hasSeafood: "含海鲜", isSpecialty: "主厨特色菜", isNew: "新品" },
  ja: { isVegetarian: "ベジタリアン", isVegan: "ヴィーガン", isGlutenFree: "グルテンフリー", hasSeafood: "魚介類を含む", isSpecialty: "シェフのスペシャル", isNew: "新登場" },
  ko: { isVegetarian: "채식", isVegan: "비건", isGlutenFree: "글루텐 프리", hasSeafood: "해산물 포함", isSpecialty: "셰프 스페셜", isNew: "신메뉴" },
  hi: { isVegetarian: "शाकाहारी", isVegan: "वीगन", isGlutenFree: "ग्लूटेन-मुक्त", hasSeafood: "समुद्री भोजन शामिल है", isSpecialty: "शेफ़ स्पेशल", isNew: "नया" },
  th: { isVegetarian: "มังสวิรัติ", isVegan: "วีแกน", isGlutenFree: "ปราศจากกลูเตน", hasSeafood: "มีอาหารทะเล", isSpecialty: "เมนูพิเศษของเชฟ", isNew: "ใหม่" },
  vi: { isVegetarian: "Chay", isVegan: "Thuần chay", isGlutenFree: "Không chứa gluten", hasSeafood: "Có hải sản", isSpecialty: "Đặc sản của bếp trưởng", isNew: "Mới" },
  sw: { isVegetarian: "Mboga", isVegan: "Vegan", isGlutenFree: "Bila gluteni", hasSeafood: "Ina dagaa", isSpecialty: "Maalum wa mpishi", isNew: "Mpya" },
};

export function dietaryLabel(key: DietaryKey, lang: string): string {
  return DIETARY_LABELS[lang]?.[key] ?? DIETARY_LABELS.en[key];
}
