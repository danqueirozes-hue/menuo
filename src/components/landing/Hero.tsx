import Image from "next/image";
import { Check } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { LandingDict, SiteLocale, signupHref } from "@/lib/landing-content";
import { LANDING_CONFIG } from "@/lib/landing/config";

export function Hero({ dict, cta, locale }: { dict: LandingDict["hero"]; cta: string; locale: SiteLocale }) {
  return (
    <section data-section="hero" className="relative overflow-hidden bg-navy text-paper">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber/20 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-28">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-6 rounded-full border border-amber/40 px-4 py-1 text-xs uppercase tracking-[0.25em] text-amber-soft">
            {dict.eyebrow}
          </span>
          <h1 className="font-display max-w-xl text-4xl leading-tight sm:text-6xl">
            {dict.titlePlain} <span className="text-amber">{dict.titleHighlight}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-paper/70 sm:text-lg">{dict.subtitle}</p>
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <LinkButton href={signupHref(locale)} variant="amber">
              {cta}
            </LinkButton>
            <LinkButton
              href={LANDING_CONFIG.demoMenuPath ? "#demo" : "#how-it-works"}
              variant="outline"
              className="border-paper/30 text-paper hover:border-amber hover:text-amber"
            >
              {dict.cta2}
            </LinkButton>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-paper/75 lg:justify-start">
            {dict.trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-amber" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-amber/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-paper/10 shadow-2xl shadow-black/40">
            <Image
              src="/images/landing/hero-table.jpg"
              alt={dict.imageAlt}
              width={1264}
              height={848}
              priority
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 384px, 90vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
