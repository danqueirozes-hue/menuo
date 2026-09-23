"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PLAN_ORDER, PLANS, PlanKey, BillingInterval, formatPlanPrice } from "@/lib/plans";

export function BillingPlans({
  currentPlan,
  status,
}: {
  currentPlan: string | null;
  status: string | null;
}) {
  const searchParams = useSearchParams();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isActive = status === "active" || status === "trialing";

  useEffect(() => {
    if (searchParams.get("activated") === "1") setNotice("Your subscription is now active — you can publish your menus.");
    if (searchParams.get("success") === "1") setNotice("Payment received — your subscription is now active.");
    if (searchParams.get("canceled") === "1") setNotice("Checkout was canceled — no changes were made.");

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
      setError(data.error || "Could not start checkout.");
      return;
    }
    window.location.href = data.url;
  }

  async function cancel() {
    if (!confirm("Cancel your subscription? Your menus will stop being publishable.")) return;
    setCancelling(true);
    await fetch("/api/billing/cancel", { method: "POST" });
    setCancelling(false);
    window.location.reload();
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
            Monthly
          </button>
          <button
            onClick={() => setInterval("annual")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              interval === "annual" ? "bg-navy text-paper" : "text-ink-soft hover:text-ink"
            }`}
          >
            Annual
          </button>
        </div>
        {interval === "annual" && (
          <span className="rounded-full bg-green/15 px-3 py-1 text-xs font-medium text-green">
            2 months free
          </span>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {PLAN_ORDER.map((key) => {
          const plan = PLANS[key];
          const isCurrent = currentPlan === key && isActive;
          return (
            <div
              key={key}
              className={`rounded-xl border p-6 ${
                isCurrent ? "border-amber bg-amber/5" : "border-border bg-panel"
              }`}
            >
              <p className="font-display text-xl text-ink">{plan.name}</p>
              <p className="font-display mt-1 text-2xl text-amber">{formatPlanPrice(plan, interval)}</p>
              <p className="mt-1 text-xs text-ink-soft">{plan.tagline}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={14} className="text-green" /> {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full bg-green/15 px-3 py-1 text-xs text-green">Current plan</span>
                  <button
                    onClick={cancel}
                    disabled={cancelling}
                    className="text-xs text-ink-soft hover:text-red-600"
                  >
                    {cancelling ? "Cancelling…" : "Cancel"}
                  </button>
                </div>
              ) : (
                <Button
                  variant="amber"
                  className="mt-5 w-full"
                  onClick={() => subscribe(key)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === key ? "Redirecting…" : isActive ? "Switch plan" : "Subscribe"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
