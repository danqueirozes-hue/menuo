import { ChevronDown } from "lucide-react";
import { LandingDict } from "@/lib/landing-content";

/** Section 9: native <details> accordion — no JavaScript needed. */
export function Faq({ dict }: { dict: LandingDict["faq"] }) {
  return (
    <section id="faq" className="defer-render scroll-mt-20 bg-panel py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-center text-3xl text-ink sm:text-4xl">{dict.title}</h2>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-paper">
          {dict.items.map((item) => (
            <details key={item.q} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown size={18} className="shrink-0 text-ink-soft transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
