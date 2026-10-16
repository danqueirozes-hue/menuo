// Small guest-facing UI strings for the public menu (filter button, empty
// state), localized across the 20 supported languages.
type BaseKey = "filterLabel" | "clearFilters" | "noMatches";
type AllergenUiKey =
  | "avoidPrompt"
  | "onlyPrompt"
  | "noAllergens"
  | "allergensUnconfirmed"
  | "sheetTitle"
  | "triggerLabel"
  | "showDishes"
  | "avoidingLabel";
type MenuStringKey = BaseKey | AllergenUiKey;

// Allergen filter / dish-card strings, in AllergenUiKey order.
const ALLERGEN_UI: Record<string, string[]> = {
  en: ["Tap what you need to avoid:", "Show only:", "No declared allergens", "Allergens not confirmed — please ask staff", "Allergies & diet", "Allergies", "Show {count} dishes", "Avoiding:"],
  fr: ["Touchez ce que vous devez éviter :", "Afficher uniquement :", "Aucun allergène déclaré", "Allergènes non confirmés — demandez au personnel", "Allergies et régime", "Allergies", "Voir {count} plats", "À éviter :"],
  de: ["Tippen Sie an, was Sie meiden müssen:", "Nur anzeigen:", "Keine deklarierten Allergene", "Allergene nicht bestätigt – bitte beim Personal nachfragen", "Allergien & Ernährung", "Allergien", "{count} Gerichte anzeigen", "Ohne:"],
  es: ["Toca lo que necesitas evitar:", "Mostrar solo:", "Sin alérgenos declarados", "Alérgenos sin confirmar: consulta al personal", "Alergias y dieta", "Alergias", "Ver {count} platos", "Evitando:"],
  it: ["Tocca ciò che devi evitare:", "Mostra solo:", "Nessun allergene dichiarato", "Allergeni non confermati: chiedi al personale", "Allergie e dieta", "Allergie", "Mostra {count} piatti", "Da evitare:"],
  pt: ["Toque no que precisa de evitar:", "Mostrar apenas:", "Sem alergénios declarados", "Alergénios não confirmados — pergunte ao empregado", "Alergias e dieta", "Alergias", "Ver {count} pratos", "A evitar:"],
  nl: ["Tik aan wat je moet vermijden:", "Alleen tonen:", "Geen allergenen opgegeven", "Allergenen niet bevestigd — vraag het personeel", "Allergieën & dieet", "Allergieën", "Toon {count} gerechten", "Vermijden:"],
  pl: ["Dotknij tego, czego musisz unikać:", "Pokaż tylko:", "Brak deklarowanych alergenów", "Alergeny niepotwierdzone — zapytaj obsługę", "Alergie i dieta", "Alergie", "Pokaż dania ({count})", "Unikam:"],
  sv: ["Tryck på det du behöver undvika:", "Visa endast:", "Inga deklarerade allergener", "Allergener ej bekräftade – fråga personalen", "Allergier & kost", "Allergier", "Visa {count} rätter", "Undviker:"],
  el: ["Πατήστε ό,τι πρέπει να αποφύγετε:", "Εμφάνιση μόνο:", "Δεν δηλώθηκαν αλλεργιογόνα", "Τα αλλεργιογόνα δεν έχουν επιβεβαιωθεί — ρωτήστε το προσωπικό", "Αλλεργίες & διατροφή", "Αλλεργίες", "Προβολή {count} πιάτων", "Αποφυγή:"],
  ru: ["Отметьте, чего вам нужно избегать:", "Показать только:", "Аллергены не заявлены", "Аллергены не подтверждены — уточните у персонала", "Аллергии и диета", "Аллергии", "Показать блюда: {count}", "Исключить:"],
  tr: ["Kaçınmanız gerekenlere dokunun:", "Yalnızca göster:", "Beyan edilmiş alerjen yok", "Alerjenler doğrulanmadı — lütfen personele sorun", "Alerjiler ve diyet", "Alerjiler", "{count} yemeği göster", "Kaçınılan:"],
  ar: ["اضغط على ما تحتاج إلى تجنبه:", "عرض فقط:", "لا توجد مسببات حساسية معلنة", "مسببات الحساسية غير مؤكدة — يرجى سؤال الموظفين", "الحساسية والنظام الغذائي", "الحساسية", "عرض {count} طبق", "تجنّب:"],
  zh: ["点选您需要避免的成分：", "仅显示：", "未申报过敏原", "过敏原信息未确认，请咨询服务员", "过敏与饮食", "过敏原", "查看 {count} 道菜", "避免："],
  ja: ["避けたいものをタップしてください：", "次のみ表示：", "申告されたアレルゲンなし", "アレルゲン情報は未確認です。スタッフにお尋ねください", "アレルギーと食事制限", "アレルギー", "{count} 品を表示", "除外："],
  ko: ["피해야 할 항목을 누르세요:", "다음만 표시:", "표시된 알레르기 유발 물질 없음", "알레르기 정보 미확인 — 직원에게 문의하세요", "알레르기 및 식단", "알레르기", "요리 {count}개 보기", "제외:"],
  hi: ["जिससे बचना है उस पर टैप करें:", "केवल दिखाएं:", "कोई घोषित एलर्जेन नहीं", "एलर्जेन की पुष्टि नहीं — कृपया स्टाफ से पूछें", "एलर्जी और आहार", "एलर्जी", "{count} व्यंजन देखें", "बचें:"],
  th: ["แตะสิ่งที่คุณต้องหลีกเลี่ยง:", "แสดงเฉพาะ:", "ไม่มีสารก่อภูมิแพ้ที่แจ้งไว้", "ยังไม่ยืนยันข้อมูลสารก่อภูมิแพ้ โปรดสอบถามพนักงาน", "อาการแพ้และอาหาร", "อาการแพ้", "ดู {count} เมนู", "หลีกเลี่ยง:"],
  vi: ["Chạm vào những gì bạn cần tránh:", "Chỉ hiển thị:", "Không có chất gây dị ứng được khai báo", "Chưa xác nhận chất gây dị ứng — vui lòng hỏi nhân viên", "Dị ứng & chế độ ăn", "Dị ứng", "Xem {count} món", "Tránh:"],
  sw: ["Gusa unachohitaji kuepuka:", "Onyesha tu:", "Hakuna vizio vilivyotangazwa", "Vizio havijathibitishwa — tafadhali uliza wahudumu", "Mzio na lishe", "Mzio", "Onyesha sahani {count}", "Kuepuka:"],
};

const ALLERGEN_UI_KEYS: AllergenUiKey[] = [
  "avoidPrompt",
  "onlyPrompt",
  "noAllergens",
  "allergensUnconfirmed",
  "sheetTitle",
  "triggerLabel",
  "showDishes",
  "avoidingLabel",
];

export const MENU_STRINGS: Record<string, Record<BaseKey, string>> = {
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
  const uiIndex = ALLERGEN_UI_KEYS.indexOf(key as AllergenUiKey);
  if (uiIndex !== -1) return (ALLERGEN_UI[lang] ?? ALLERGEN_UI.en)[uiIndex];
  return MENU_STRINGS[lang]?.[key as BaseKey] ?? MENU_STRINGS.en[key as BaseKey];
}
