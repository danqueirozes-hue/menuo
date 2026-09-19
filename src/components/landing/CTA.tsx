import { LinkButton } from "@/components/ui/Button";
import { LandingDict } from "@/lib/landing-content";

export function CTA({ dict }: { dict: LandingDict["cta"] }) {
  return (
    <section className="bg-navy py-20 text-paper">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">
          {dict.titlePrefix} <span className="text-amber">{dict.titleHighlight}</span> {dict.titleSuffix}
        </h2>
        <p className="max-w-lg text-paper/70">{dict.subtitle}</p>
        <LinkButton href="/signup" className="bg-amber text-navy hover:bg-amber-soft">
          {dict.button}
        </LinkButton>
      </div>
    </section>
  );
}
