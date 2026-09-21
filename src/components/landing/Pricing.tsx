"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PLAN_ORDER, PLANS, formatPlanPrice, BillingInterval } from "@/lib/plans";
import { LandingDict } from "@/lib/landing-content";

export function Pricing({ dict }: { dict: LandingDict["pricing"] }) {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  return (
    <section id="pricing" className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber">{dict.eyebrow}</span>
          <h2 className="font-display mt-4 text-3xl text-ink sm:text-4xl">{dict.title}</h2>
          <p className="mt-4 text-ink-soft">{dict.subtitle}</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="inline-flex rounded-full border border-border bg-panel p-1">
            <button
              onClick={() => setInterval("monthly")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                interval === "monthly" ? "bg-navy text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {dict.monthly}
            </button>
            <button
              onClick={() => setInterval("annual")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                interval === "annual" ? "bg-navy text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {dict.annual}
            </button>
          </div>
          {interval === "annual" && (
            <span className="rounded-full bg-green/15 px-3 py-1 text-xs font-medium text-green">
              {dict.annualNote}
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN_ORDER.map((key) => {
            const plan = PLANS[key];
            const isMostPopular = key === "business";
            return (
              <div
                key={key}
                className={`relative rounded-xl border p-6 ${
                  isMostPopular ? "border-amber bg-white shadow-md" : "border-border bg-panel"
                }`}
              >
                {isMostPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber px-3 py-1 text-[11px] font-medium text-navy">
                    Most popular
                  </span>
                )}
                <p className="font-display text-lg text-ink">{plan.name}</p>
                <p className="font-display mt-1 text-2xl text-amber">
                  {formatPlanPrice(plan, interval)}
                </p>
                <p className="mt-1 text-xs text-ink-soft">{plan.tagline}</p>
                <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={14} className="mt-0.5 shrink-0 text-green" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?plan=${key}&interval=${interval}`}
                  className={`mt-6 block rounded-full px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                    isMostPopular
                      ? "bg-amber text-navy hover:bg-amber-soft"
                      : "border border-ink/20 text-ink hover:border-amber hover:text-amber"
                  }`}
                >
                  {dict.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-ink-soft">{dict.note}</p>
      </div>
    </section>
  );
}
