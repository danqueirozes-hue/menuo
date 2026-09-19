// Small guest-facing UI strings for the public menu (filter button, empty
// state), localized across the 20 supported languages.
type MenuStringKey = "filterLabel" | "clearFilters" | "noMatches";

export const MENU_STRINGS: Record<string, Record<MenuStringKey, string>> = {
  en: { filterLabel: "Filter", clearFilters: "Clear filters", noMatches: "No dishes match your filters." },
  fr: { filterLabel: "Filtrer", clearFilters: "Effacer les filtres", noMatches: "Aucun plat ne correspond à vos filtres." },
  de: { filterLabel: "Filtern", clearFilters: "Filter zurücksetzen", noMatches: "Keine Gerichte entsprechen Ihren Filtern." },
  es: { filterLabel: "Filtrar", clearFilters: "Borrar filtros", noMatches: "Ningún plato coincide con tus filtros." },
  it: { filterLabel: "Filtra", clearFilters: "Cancella filtri", noMatches: "Nessun piatto corrisponde ai filtri." },
  pt: { filterLabel: "Filtrar", clearFilters: "Limpar filtros", noMatches: "Nenhum prato corresponde aos filtros." },
  nl: { filterLabel: "Filteren", clearFilters: "Filters wissen", noMatches: "Geen gerechten komen overeen met je filters." },
  pl: { filterLabel: "Filtruj", clearFilters: "Wyczyść filtry", noMatches: "Żadne danie nie pasuje do filtrów." },
  sv: { filterLabel: "Filtrera", clearFilters: "Rensa filter", noMatches: "Inga rätter matchar dina filter." },
  el: { filterLabel: "Φίλτρο", clearFilters: "Καθαρισμός φίλτρων", noMatches: "Κανένα πιάτο δεν ταιριάζει με τα φίλτρα σας." },
  ru: { filterLabel: "Фильтр", clearFilters: "Сбросить фильтры", noMatches: "Нет блюд, соответствующих фильтрам." },
  tr: { filterLabel: "Filtrele", clearFilters: "Filtreleri temizle", noMatches: "Filtrelerinize uyan yemek yok." },
  ar: { filterLabel: "تصفية", clearFilters: "مسح الفلاتر", noMatches: "لا توجد أطباق تطابق عوامل التصفية." },
  zh: { filterLabel: "筛选", clearFilters: "清除筛选", noMatches: "没有符合筛选条件的菜品。" },
  ja: { filterLabel: "フィルター", clearFilters: "フィルターを解除", noMatches: "条件に一致する料理がありません。" },
  ko: { filterLabel: "필터", clearFilters: "필터 지우기", noMatches: "필터와 일치하는 요리가 없습니다." },
  hi: { filterLabel: "फ़िल्टर", clearFilters: "फ़िल्टर हटाएं", noMatches: "आपके फ़िल्टर से कोई व्यंजन मेल नहीं खाता।" },
  th: { filterLabel: "ตัวกรอง", clearFilters: "ล้างตัวกรอง", noMatches: "ไม่มีเมนูที่ตรงกับตัวกรองของคุณ" },
  vi: { filterLabel: "Bộ lọc", clearFilters: "Xóa bộ lọc", noMatches: "Không có món nào phù hợp với bộ lọc." },
  sw: { filterLabel: "Chuja", clearFilters: "Futa vichujio", noMatches: "Hakuna sahani zinazolingana na vichujio vyako." },
};

export function menuString(key: MenuStringKey, lang: string): string {
  return MENU_STRINGS[lang]?.[key] ?? MENU_STRINGS.en[key];
}
