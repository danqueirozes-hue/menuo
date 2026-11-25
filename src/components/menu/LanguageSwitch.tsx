"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Globe, X } from "lucide-react";
import { LANGUAGES, getLanguage } from "@/lib/languages";

/** "Language" in each language, for the sheet title and the button's label. */
const LANGUAGE_WORD: Record<string, string> = {
  en: "Language", fr: "Langue", de: "Sprache", es: "Idioma", it: "Lingua", pt: "Idioma", nl: "Taal",
  pl: "Język", sv: "Språk", el: "Γλώσσα", ru: "Язык", tr: "Dil", ar: "اللغة", zh: "语言", ja: "言語",
  ko: "언어", hi: "भाषा", th: "ภาษา", vi: "Ngôn ngữ", sw: "Lugha",
};

/** Guest-facing language switcher: a clearly labeled button (big in the
 * header, compact in the sticky nav) that opens a sheet with all languages,
 * right on top of the menu — no trip back to the language screen. */
export function LanguageSwitch({ slug, lang, variant }: { slug: string; lang: string; variant: "hero" | "compact" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = getLanguage(lang);
  const word = LANGUAGE_WORD[lang] ?? LANGUAGE_WORD.en;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(code: string) {
    setOpen(false);
    if (code !== lang) router.replace(`/m/${slug}?lang=${code}`, { scroll: false });
  }

  return (
    <>
      {variant === "hero" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-amber/60 bg-paper/10 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-amber hover:bg-paper/15"
        >
          <Globe size={17} className="text-amber" />
          <span className="text-base leading-none">{current.flag}</span>
          {current.nativeName}
          <ChevronDown size={16} className="text-amber" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={word}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-navy/30 px-3 py-1.5 text-sm text-navy transition-colors hover:border-amber hover:text-amber"
        >
          <Globe size={15} className="shrink-0" />
          <span className="leading-none">{current.flag}</span>
          <span className="font-medium uppercase">{current.code}</span>
        </button>
      )}

      {/* Portaled to <body>: the sticky nav's backdrop-blur would otherwise
          become the containing block and trap this fixed sheet inside it. */}
      {open &&
        createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={word}>
          <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-navy/50" />
          <div className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-paper px-5 pb-8 pt-5 shadow-2xl sm:max-w-lg sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display flex items-center gap-2 text-xl text-ink">
                <Globe size={20} className="text-amber" /> {word}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((l) => {
                const active = l.code === lang;
                return (
                  <li key={l.code}>
                    <button
                      type="button"
                      onClick={() => choose(l.code)}
                      lang={l.code}
                      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-start transition-colors ${
                        active ? "border-amber bg-amber/10" : "border-border bg-panel hover:border-amber"
                      }`}
                    >
                      <span className="text-xl leading-none">{l.flag}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{l.nativeName}</span>
                        <span className="block truncate text-[11px] text-ink-soft">{l.englishName}</span>
                      </span>
                      {active && <Check size={16} className="shrink-0 text-amber" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
