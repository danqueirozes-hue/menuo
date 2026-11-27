import Image from "next/image";
import { Flag } from "@/components/ui/Flag";
import { RiseOnView } from "@/components/landing/RiseOnView";
import { LandingDict } from "@/lib/landing-content";
import { LANDING_CONFIG } from "@/lib/landing/config";

/** Section 5: dish names stay in the original language. The dish photo
 * carries the section; each language floats over it as a frosted-glass card,
 * rising in one after another. */
export function DishNames({ dict }: { dict: LandingDict["names"] }) {
  if (!LANDING_CONFIG.dishNamesKept) return null;
  return (
    <section className="defer-render bg-paper py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 md:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{dict.title}</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{dict.text}</p>
        </div>

        <div className="relative h-[560px] overflow-hidden rounded-[1.75rem] shadow-2xl shadow-navy/20 sm:h-[540px]">
          <Image
            src="/images/landing/cacio-e-pepe.jpg"
            alt={dict.imageAlt}
            fill
            sizes="(min-width: 768px) 540px, 100vw"
            className="object-cover object-[55%_22%] sm:object-[55%_40%]"
          />
          {/* Navy wash at the bottom so the glass cards read on any part of the photo. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/15 to-transparent" />

          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-sm text-ink shadow-sm ring-1 ring-white/60 backdrop-blur-md">
            <Flag code="it" className="h-3.5 w-[1.15rem]" />
            <span className="font-display">{dict.original}</span>
          </span>

          <RiseOnView className="absolute inset-x-4 bottom-4 flex flex-col gap-2.5 sm:inset-x-5 sm:bottom-5">
            {dict.translations.map((t, i) => (
              <div
                key={t.lang}
                // Fanned slightly to the right, like cards dealt from the original.
                style={{ marginLeft: `${i * 14}px`, transitionDelay: `${150 + i * 180}ms` }}
                className="rise-item rounded-2xl bg-white/70 px-4 py-3 shadow-lg shadow-navy/20 ring-1 ring-white/60 backdrop-blur-md"
              >
                <p className="flex items-center gap-2">
                  <Flag code={t.lang.toLowerCase()} className="h-3.5 w-[1.15rem]" />
                  <span className="text-[11px] font-semibold tracking-wide text-ink-soft">{t.lang}</span>
                  <span className="font-display text-ink">{dict.original}</span>
                </p>
                <p className="mt-0.5 text-sm leading-snug text-ink-soft">{t.text}</p>
              </div>
            ))}
          </RiseOnView>
        </div>
      </div>
    </section>
  );
}
