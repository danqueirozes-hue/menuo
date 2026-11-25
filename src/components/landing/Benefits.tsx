import { LandingDict } from "@/lib/landing-content";

export function Benefits({ dict }: { dict: LandingDict["benefits"] }) {
  return (
    <section id="benefits" className="defer-render bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display mx-auto max-w-3xl text-center text-3xl text-ink sm:text-4xl">{dict.title}</h2>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.items.map((b, i) => (
            <div key={b.title} className="rounded-2xl border border-border bg-panel p-6">
              <span className="font-display text-3xl text-amber-soft">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display mt-3 text-lg text-ink">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
