"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PLAN_ORDER, PLANS, PlanKey, BillingInterval, formatPlanPrice } from "@/lib/plans";
import type { BillingPlansDict } from "@/lib/billing-content";

export function BillingPlans({
  dict,
  currentPlan,
  status,
  cancelAtPeriodEnd,
  currentPeriodEnd,
  eligibleForTrial,
}: {
  dict: BillingPlansDict;
  currentPlan: string | null;
  status: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  eligibleForTrial: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingCancelUntil, setPendingCancelUntil] = useState<string | null>(
    cancelAtPeriodEnd ? currentPeriodEnd : null
  );

  const isActive = status === "active" || status === "trialing";
  const periodEndLabel = pendingCancelUntil
    ? new Date(pendingCancelUntil).toLocaleDateString(dict.dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  useEffect(() => {
    if (searchParams.get("activated") === "1") setNotice(dict.noticeActivated);
    // Legacy return URL from checkouts started before the move to
    // /dashboard/billing/confirmado (which now reports the conversion).
    if (searchParams.get("success") === "1") {
      setNotice(dict.noticePaid);
      const params = new URLSearchParams(searchParams);
      params.delete("success");
      router.replace(params.size ? `${pathname}?${params}` : pathname);
    }
    if (searchParams.get("canceled") === "1") setNotice(dict.noticeCanceled);

    const requestedPlan = searchParams.get("plan") as PlanKey | null;
    const requestedInterval: BillingInterval = searchParams.get("interval") === "annual" ? "annual" : "monthly";
    if (requestedPlan && PLAN_ORDER.includes(requestedPlan) && requestedPlan !== currentPlan) {
      setInterval(requestedInterval);
      subscribe(requestedPlan, requestedInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function subscribe(plan: PlanKey, intervalOverride?: BillingInterval) {
    setLoadingPlan(plan);
    setError(null);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, interval: intervalOverride ?? interval }),
    });
    const data = await res.json();
    setLoadingPlan(null);
    if (!res.ok) {
      setError(data.error || dict.checkoutError);
      return;
    }
    window.location.href = data.url;
  }

  async function cancel() {
    if (!confirm(dict.cancelConfirm)) return;
    setCancelling(true);
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const data = await res.json();
    setCancelling(false);
    if (data.currentPeriodEnd) {
      setPendingCancelUntil(data.currentPeriodEnd);
    } else {
      window.location.reload();
    }
  }

  async function resume() {
    setResuming(true);
    await fetch("/api/billing/resume", { method: "POST" });
    setResuming(false);
    setPendingCancelUntil(null);
  }

  return (
    <div>
      {notice && (
        <div className="mb-6 rounded-lg bg-green/10 px-4 py-3 text-sm text-green">{notice}</div>
      )}
      {error && <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="mb-6 flex items-center gap-3">
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

      <div className="grid gap-5 sm:grid-cols-2">
        {PLAN_ORDER.map((key) => {
          const plan = PLANS[key];
          const text = dict.plans[key];
          const isCurrent = currentPlan === key && isActive;
          return (
            <div
              key={key}
              className={`rounded-xl border p-6 ${
                isCurrent ? "border-amber bg-amber/5" : "border-border bg-panel"
              }`}
            >
              <p className="font-display text-xl text-ink">{plan.name}</p>
              <p className="font-display mt-1 text-2xl text-amber">{formatPlanPrice(plan, interval, dict.price)}</p>
              {interval === "monthly" && (
                <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green">
                  {formatPlanPrice(plan, "annual", dict.price)} · {dict.annualNote}
                </p>
              )}
              <p className="mt-2 text-xs text-ink-soft">{text.tagline}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                {text.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={14} className="text-green" /> {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-green/15 px-3 py-1 text-xs text-green">
                      {pendingCancelUntil ? dict.endingSoon : dict.currentPlan}
                    </span>
                    {pendingCancelUntil ? (
                      <button
                        onClick={resume}
                        disabled={resuming}
                        className="text-xs text-amber hover:underline"
                      >
                        {resuming ? dict.resuming : dict.resume}
                      </button>
                    ) : (
                      <button
                        onClick={cancel}
                        disabled={cancelling}
                        className="text-xs text-ink-soft hover:text-red-600"
                      >
                        {cancelling ? dict.cancelling : dict.cancel}
                      </button>
                    )}
                  </div>
                  {pendingCancelUntil && (
                    <p className="mt-2 text-xs text-ink-soft">
                      {dict.activeThroughPrefix} <strong>{periodEndLabel}</strong>
                      {dict.activeThroughSuffix}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    variant="amber"
                    className="mt-5 w-full"
                    onClick={() => subscribe(key)}
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === key ? dict.redirecting : isActive ? dict.switchPlan : dict.subscribe}
                  </Button>
                  {!isActive && eligibleForTrial && (
                    <p className="mt-2 text-center text-xs text-ink-soft">{dict.trialNote}</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
