export type Language = {
  code: string;
  englishName: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
};

// 20 languages, chosen to cover the main language of every continent with a
// weight toward Europe (MENUO's primary market).
export const LANGUAGES: Language[] = [
  { code: "en", englishName: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "fr", englishName: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", englishName: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "es", englishName: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "it", englishName: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  // Provisionally showing the Brazilian flag while MENUO tests with Brazilian restaurants.
  { code: "pt", englishName: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "nl", englishName: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", englishName: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "sv", englishName: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "el", englishName: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "ru", englishName: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "tr", englishName: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "ar", englishName: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "zh", englishName: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", englishName: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", englishName: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "th", englishName: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", englishName: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "sw", englishName: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
];

export const DEFAULT_LANGUAGE = "en";

export function getLanguage(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function isValidLanguage(code: string): boolean {
  return LANGUAGES.some((l) => l.code === code);
}
