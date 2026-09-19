import { LinkButton } from "@/components/ui/Button";
import { LandingDict } from "@/lib/landing-content";

export function Hero({ dict }: { dict: LandingDict["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-navy text-paper">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center sm:py-36">
        <span className="mb-6 rounded-full border border-amber/40 px-4 py-1 text-xs uppercase tracking-[0.25em] text-amber-soft">
          {dict.badge}
        </span>
        <h1 className="font-display max-w-3xl text-4xl leading-tight sm:text-6xl">
          {dict.titlePlain} <span className="text-amber">{dict.titleHighlight}</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-paper/70 sm:text-lg">{dict.subtitle}</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <LinkButton href="/signup" className="bg-amber text-navy hover:bg-amber-soft">
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
    </section>
  );
}
