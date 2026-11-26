import { LANGUAGES } from "@/lib/languages";
import { LandingDict } from "@/lib/landing-content";
import { Flag } from "@/components/ui/Flag";

export function LanguagesShowcase({ dict }: { dict: LandingDict["languagesSection"] }) {
  return (
    <section id="languages" className="defer-render bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">{dict.title}</h2>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-5">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="flex items-center gap-3 rounded-lg border border-border bg-panel px-4 py-3 text-left"
            >
              <Flag code={lang.code} className="h-5 w-[1.66rem]" />
              <div>
                <p className="text-sm font-medium text-ink">{lang.nativeName}</p>
                <p className="text-xs text-ink-soft">{lang.englishName}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-soft">{dict.note}</p>
      </div>
    </section>
  );
}
