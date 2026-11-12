"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ExternalLink } from "lucide-react";
import type { DashboardDict } from "@/lib/dashboard-content";

type Subscription = {
  planName: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  /** Already formatted for display. */
  periodEnd: string | null;
  hasBillingAccount: boolean;
};

const card = "rounded-2xl border border-border bg-panel p-6";

export function AccountPanel({
  dict: t,
  profile,
  subscription: sub,
  canDelete,
}: {
  dict: DashboardDict["account"];
  profile: { name: string; email: string; memberSince: string };
  subscription: Subscription | null;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"portal" | "cancel" | "resume" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState("");

  const isActive = sub?.status === "active" || sub?.status === "trialing";
  const isTrial = sub?.status === "trialing";
  const date = sub?.periodEnd ?? "";

  function statusLine(): string {
    if (!sub) return t.noPlan;
    if (isActive && sub.cancelAtPeriodEnd) return (isTrial ? t.trialCancelPending : t.cancelPending).replace("{date}", date);
    if (isTrial) return t.trialing.replace("{date}", date);
    if (sub.status === "active") return t.active.replace("{date}", date);
    if (sub.status === "past_due" || sub.status === "unpaid") return t.pastDue;
    return t.canceled;
  }

  async function call(kind: "cancel" | "resume") {
    if (kind === "cancel" && !confirm(t.cancelConfirm.replace("{date}", date))) return;
    setBusy(kind);
    setError(null);
    const res = await fetch(`/api/billing/${kind}`, { method: "POST" });
    setBusy(null);
    if (!res.ok) return setError(t.error);
    router.refresh();
  }

  async function openPortal() {
    setBusy("portal");
    setError(null);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      setBusy(null);
      return setError(t.error);
    }
    window.location.href = data.url;
  }

  async function deleteAccount() {
    setBusy("delete");
    setError(null);
    const res = await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: confirmEmail }),
    });
    if (!res.ok) {
      setBusy(null);
      return setError(t.error);
    }
    // Clear the session cookie through the regular logout route, which
    // redirects to the home page.
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/logout";
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="mt-8 space-y-6">
      <section className={card}>
        <h2 className="font-display text-lg text-ink">{t.profile}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[10rem_1fr]">
          <dt className="text-ink-soft">{t.name}</dt>
          <dd className="text-ink">{profile.name}</dd>
          <dt className="text-ink-soft">{t.email}</dt>
          <dd className="text-ink">{profile.email}</dd>
          <dt className="text-ink-soft">{t.memberSince}</dt>
          <dd className="text-ink">{profile.memberSince}</dd>
        </dl>
      </section>

      <section className={card}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-ink">{t.plan}</h2>
            {sub && isActive && <p className="mt-1 text-sm font-medium text-ink">{sub.planName}</p>}
            <p className="mt-1 text-sm text-ink-soft">{statusLine()}</p>
          </div>
          <Link
            href="/dashboard/billing"
            prefetch={false}
            className="rounded-full border border-ink/20 px-4 py-2 text-sm text-ink hover:border-amber hover:text-amber"
          >
            {isActive ? t.changePlan : t.choosePlan}
          </Link>
        </div>

        {sub?.hasBillingAccount && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-medium text-ink">{t.invoices}</p>
            <p className="mt-1 text-xs text-ink-soft">{t.invoicesHint}</p>
            <button
              onClick={openPortal}
              disabled={busy !== null}
              className="mt-3 inline-flex items-center gap-2 text-sm text-amber hover:underline disabled:opacity-50"
            >
              <CreditCard size={15} /> {busy === "portal" ? t.opening : t.invoices} <ExternalLink size={13} />
            </button>
          </div>
        )}

        {isActive && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-medium text-ink">{t.cancelTitle}</p>
            {sub!.cancelAtPeriodEnd ? (
              <button
                onClick={() => call("resume")}
                disabled={busy !== null}
                className="mt-3 rounded-full bg-navy px-5 py-2 text-sm font-medium text-paper hover:bg-navy-soft disabled:opacity-50"
              >
                {t.resumeCta}
              </button>
            ) : (
              <>
                <p className="mt-1 text-xs text-ink-soft">
                  {(isTrial ? t.cancelTrialHint : t.cancelHint).replace("{date}", date)}
                </p>
                <button
                  onClick={() => call("cancel")}
                  disabled={busy !== null}
                  className="mt-3 rounded-full border border-red-300 px-5 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {busy === "cancel" ? t.cancelling : t.cancelCta}
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {canDelete && (
        <section className="rounded-2xl border border-red-200 bg-panel p-6">
          <h2 className="font-display text-lg text-red-700">{t.deleteTitle}</h2>
          <p className="mt-2 text-sm text-ink-soft">{t.deleteHint}</p>
          <label className="mt-4 block text-xs text-ink-soft">
            {t.deletePrompt}
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={profile.email}
              className="mt-1 block w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-red-400 focus:outline-none"
            />
          </label>
          <button
            onClick={deleteAccount}
            disabled={busy !== null || confirmEmail.trim().toLowerCase() !== profile.email.toLowerCase()}
            className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy === "delete" ? t.deleting : t.deleteCta}
          </button>
        </section>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
