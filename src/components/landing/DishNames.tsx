import { LandingDict } from "@/lib/landing-content";
import { LANDING_CONFIG } from "@/lib/landing/config";

/** Section 5: dish names stay in the original language. */
export function DishNames({ dict }: { dict: LandingDict["names"] }) {
  if (!LANDING_CONFIG.dishNamesKept) return null;
  return (
    <section className="defer-render bg-paper py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{dict.title}</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{dict.text}</p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-6 shadow-sm">
          <p className="font-display text-2xl text-ink">{dict.original}</p>
          <ul className="mt-5 space-y-4">
            {dict.translations.map((t) => (
              <li key={t.lang} className="border-t border-border pt-4">
                <span className="mr-2 rounded-full bg-navy px-2 py-0.5 text-[11px] font-medium text-paper">{t.lang}</span>
                <span className="font-display text-ink">{dict.original}</span>
                <p className="mt-1 text-sm text-ink-soft">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
