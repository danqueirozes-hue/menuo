import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import type { DashboardDict, OnboardingStep } from "@/lib/dashboard-content";

// Trial first: new accounts start it at signup (card required), so it's
// already ticked when they first land here.
const ORDER: OnboardingStep[] = ["trial", "section", "dish", "publish"];

/** First-run checklist on the menus page. Every signup so far stopped right
 * after creating the account, in front of an empty dashboard — this points
 * at the next concrete step until the first menu is live. */
export function GettingStarted({
  dict,
  done,
  hrefs,
  importLink,
}: {
  dict: DashboardDict["onboarding"];
  done: Record<OnboardingStep, boolean>;
  hrefs: Record<OnboardingStep, string>;
  importLink?: { href: string; label: string };
}) {
  const next = ORDER.find((s) => !done[s]);
  if (!next) return null;
  const count = ORDER.filter((s) => done[s]).length;

  return (
    <section className="mb-8 rounded-2xl border border-amber/40 bg-panel p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-ink">{dict.title}</h2>
          <p className="mt-1 text-sm text-ink-soft">{dict.subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-soft/40 px-3 py-1 text-xs font-medium text-ink">
          {dict.progress.replace("{done}", String(count))}
        </span>
      </div>

      <ol className="mt-6 grid gap-3">
        {ORDER.map((step, i) => {
          const isDone = done[step];
          const isNext = step === next;
          const text = dict.steps[step];
          return (
            <li
              key={step}
              className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
                isNext ? "border-amber bg-amber-soft/15" : "border-border"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  isDone ? "bg-green text-paper" : isNext ? "bg-amber text-navy" : "bg-paper text-ink-soft"
                }`}
                aria-label={isDone ? dict.done : undefined}
              >
                {isDone ? <Check size={16} /> : i + 1}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDone ? "text-ink-soft line-through" : "text-ink"}`}>
                  {text.title}
                </p>
                {!isDone && <p className="mt-0.5 text-xs text-ink-soft">{text.hint}</p>}
              </div>
              {isNext && (
                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <Link
                    href={hrefs[step]}
                    className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-navy-soft"
                  >
                    {text.cta}
                  </Link>
                  {/* Shortcut for owners who already have a printed menu. */}
                  {importLink && (step === "section" || step === "dish") && (
                    <Link
                      href={importLink.href}
                      prefetch={false}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber px-4 py-1.5 text-xs font-medium text-navy hover:bg-amber-soft"
                    >
                      <Sparkles size={13} /> {importLink.label}
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
