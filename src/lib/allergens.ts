// The 14 allergens that EU Regulation (EU) No 1169/2011 (Annex II) requires
// food businesses to declare, in the Annex's order. Stored on MenuItem as an
// array of these keys; labels are looked up per language at render time, so
// they never need machine translation.
export const ALLERGEN_KEYS = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soy",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphites",
  "lupin",
  "molluscs",
] as const;

export type AllergenKey = (typeof ALLERGEN_KEYS)[number];

export function isAllergenKey(value: string): value is AllergenKey {
  return (ALLERGEN_KEYS as readonly string[]).includes(value);
}

/** Keeps only known keys, in the canonical Annex II order. */
export function normalizeAllergens(values: readonly string[]): AllergenKey[] {
  return ALLERGEN_KEYS.filter((k) => values.includes(k));
}

type AllergenLabels = Record<AllergenKey, string>;

function labels(list: string[]): AllergenLabels {
  return Object.fromEntries(ALLERGEN_KEYS.map((k, i) => [k, list[i]])) as AllergenLabels;
}

// Same order as ALLERGEN_KEYS.
export const ALLERGEN_LABELS: Record<string, AllergenLabels> = {
  en: labels(["Gluten", "Crustaceans", "Eggs", "Fish", "Peanuts", "Soy", "Milk", "Tree nuts", "Celery", "Mustard", "Sesame", "Sulphites", "Lupin", "Molluscs"]),
  fr: labels(["Gluten", "Crustacés", "Œufs", "Poisson", "Arachides", "Soja", "Lait", "Fruits à coque", "Céleri", "Moutarde", "Sésame", "Sulfites", "Lupin", "Mollusques"]),
  de: labels(["Gluten", "Krebstiere", "Eier", "Fisch", "Erdnüsse", "Soja", "Milch", "Schalenfrüchte", "Sellerie", "Senf", "Sesam", "Sulfite", "Lupinen", "Weichtiere"]),
  es: labels(["Gluten", "Crustáceos", "Huevos", "Pescado", "Cacahuetes", "Soja", "Leche", "Frutos de cáscara", "Apio", "Mostaza", "Sésamo", "Sulfitos", "Altramuces", "Moluscos"]),
  it: labels(["Glutine", "Crostacei", "Uova", "Pesce", "Arachidi", "Soia", "Latte", "Frutta a guscio", "Sedano", "Senape", "Sesamo", "Solfiti", "Lupini", "Molluschi"]),
  pt: labels(["Glúten", "Crustáceos", "Ovos", "Peixe", "Amendoins", "Soja", "Leite", "Frutos de casca rija", "Aipo", "Mostarda", "Sésamo", "Sulfitos", "Tremoço", "Moluscos"]),
  nl: labels(["Gluten", "Schaaldieren", "Eieren", "Vis", "Pinda's", "Soja", "Melk", "Noten", "Selderij", "Mosterd", "Sesam", "Sulfieten", "Lupine", "Weekdieren"]),
  pl: labels(["Gluten", "Skorupiaki", "Jaja", "Ryby", "Orzeszki ziemne", "Soja", "Mleko", "Orzechy", "Seler", "Gorczyca", "Sezam", "Siarczyny", "Łubin", "Mięczaki"]),
  sv: labels(["Gluten", "Kräftdjur", "Ägg", "Fisk", "Jordnötter", "Soja", "Mjölk", "Nötter", "Selleri", "Senap", "Sesam", "Sulfiter", "Lupin", "Blötdjur"]),
  el: labels(["Γλουτένη", "Οστρακοειδή", "Αυγά", "Ψάρι", "Αραχίδες", "Σόγια", "Γάλα", "Ξηροί καρποί", "Σέλινο", "Μουστάρδα", "Σουσάμι", "Θειώδη", "Λούπινο", "Μαλάκια"]),
  ru: labels(["Глютен", "Ракообразные", "Яйца", "Рыба", "Арахис", "Соя", "Молоко", "Орехи", "Сельдерей", "Горчица", "Кунжут", "Сульфиты", "Люпин", "Моллюски"]),
  tr: labels(["Gluten", "Kabuklular", "Yumurta", "Balık", "Yer fıstığı", "Soya", "Süt", "Sert kabuklu yemişler", "Kereviz", "Hardal", "Susam", "Sülfitler", "Acı bakla", "Yumuşakçalar"]),
  ar: labels(["الغلوتين", "القشريات", "البيض", "السمك", "الفول السوداني", "الصويا", "الحليب", "المكسرات", "الكرفس", "الخردل", "السمسم", "الكبريتيت", "الترمس", "الرخويات"]),
  zh: labels(["麸质", "甲壳类", "蛋类", "鱼类", "花生", "大豆", "乳制品", "坚果", "芹菜", "芥末", "芝麻", "亚硫酸盐", "羽扇豆", "软体动物"]),
  ja: labels(["グルテン", "甲殻類", "卵", "魚", "落花生", "大豆", "乳", "ナッツ類", "セロリ", "からし", "ごま", "亜硫酸塩", "ルピナス", "軟体動物"]),
  ko: labels(["글루텐", "갑각류", "달걀", "생선", "땅콩", "대두", "우유", "견과류", "셀러리", "겨자", "참깨", "아황산염", "루핀", "연체동물"]),
  hi: labels(["ग्लूटेन", "क्रस्टेशियन", "अंडे", "मछली", "मूंगफली", "सोया", "दूध", "मेवे", "सेलरी", "सरसों", "तिल", "सल्फाइट", "ल्यूपिन", "मोलस्क"]),
  th: labels(["กลูเตน", "สัตว์น้ำมีเปลือก", "ไข่", "ปลา", "ถั่วลิสง", "ถั่วเหลือง", "นม", "ถั่วเปลือกแข็ง", "ขึ้นฉ่าย", "มัสตาร์ด", "งา", "ซัลไฟต์", "ลูพิน", "หอยและหมึก"]),
  vi: labels(["Gluten", "Giáp xác", "Trứng", "Cá", "Đậu phộng", "Đậu nành", "Sữa", "Các loại hạt", "Cần tây", "Mù tạt", "Mè", "Sulfit", "Đậu lupin", "Động vật thân mềm"]),
  sw: labels(["Gluteni", "Krasteshia", "Mayai", "Samaki", "Karanga", "Soya", "Maziwa", "Kokwa", "Seleri", "Haradali", "Ufuta", "Salfiti", "Lupini", "Moluska"]),
};

export function allergenLabels(lang: string): AllergenLabels {
  return ALLERGEN_LABELS[lang] ?? ALLERGEN_LABELS.en;
}
