import { LandingDict } from "@/lib/landing-content";

export function Benefits({ dict }: { dict: LandingDict["benefits"] }) {
  return (
    <section id="benefits" className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber">{dict.eyebrow}</span>
          <h2 className="font-display mt-4 text-3xl text-ink sm:text-4xl">{dict.title}</h2>
          <p className="mt-4 text-ink-soft">{dict.subtitle}</p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {dict.items.map((b, i) => (
            <div key={b.title} className="relative pl-12">
              <span className="font-display absolute left-0 top-0 text-3xl text-amber-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-lg text-ink">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
