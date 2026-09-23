import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { LandingDict } from "@/lib/landing-content";

export function Hero({ dict }: { dict: LandingDict["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-navy text-paper">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber/20 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-32">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-6 rounded-full border border-amber/40 px-4 py-1 text-xs uppercase tracking-[0.25em] text-amber-soft">
            {dict.badge}
          </span>
          <h1 className="font-display max-w-xl text-4xl leading-tight sm:text-6xl">
            {dict.titlePlain} <span className="text-amber">{dict.titleHighlight}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-paper/70 sm:text-lg">{dict.subtitle}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <LinkButton href="/signup" variant="amber">
              {dict.ctaPrimary}
            </LinkButton>
            <LinkButton
              href="#how-it-works"
              variant="outline"
              className="border-paper/30 text-paper hover:border-amber hover:text-amber"
            >
              {dict.ctaSecondary}
            </LinkButton>
          </div>
          <p className="mt-6 text-xs uppercase tracking-widest text-paper/40">{dict.note}</p>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-amber/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-paper/10 shadow-2xl shadow-black/40">
            <Image
              src="/images/landing/hero-scan.jpg"
              alt="Guest scanning a MENUO QR code and reading the digital menu on her phone at a restaurant table"
              width={1200}
              height={800}
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
