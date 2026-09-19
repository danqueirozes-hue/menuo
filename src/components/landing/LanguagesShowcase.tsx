import { LANGUAGES } from "@/lib/languages";
import { LandingDict } from "@/lib/landing-content";

export function LanguagesShowcase({ dict }: { dict: LandingDict["languagesSection"] }) {
  return (
    <section id="languages" className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-amber">{dict.eyebrow}</span>
        <h2 className="font-display mt-4 text-3xl text-ink sm:text-4xl">{dict.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">{dict.subtitle}</p>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-5">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="flex items-center gap-3 rounded-lg border border-border bg-panel px-4 py-3 text-left"
            >
              <span className="text-xl">{lang.flag}</span>
              <div>
                <p className="text-sm font-medium text-ink">{lang.englishName}</p>
                <p className="text-xs text-ink-soft">{lang.nativeName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
