import { LandingDict } from "@/lib/landing-content";

export function HowItWorks({ dict }: { dict: LandingDict["how"] }) {
  return (
    <section id="how-it-works" className="bg-navy py-24 text-paper">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber">{dict.eyebrow}</span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl">{dict.title}</h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {dict.steps.map((s) => (
            <div key={s.step} className="border-t border-amber/30 pt-6">
              <span className="font-display text-4xl text-amber-soft">{s.step}</span>
              <h3 className="font-display mt-4 text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/65">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
