"use client";

import { Fragment, useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { PLAN_ORDER, PLANS, PlanKey, BillingInterval } from "@/lib/plans";

export type AdminAccountRow = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  restaurants: string[];
  planKey: string | null;
  planName: string | null;
  interval: BillingInterval | null;
  status: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green/15 text-green",
  trialing: "bg-green/15 text-green",
  past_due: "bg-amber/15 text-amber",
  incomplete: "bg-ink-soft/10 text-ink-soft",
  canceled: "bg-red-50 text-red-600",
};

const STATUS_OPTIONS = ["active", "trialing", "past_due", "canceled", "incomplete"];

const selectClass =
  "rounded-md border border-border bg-panel px-2 py-1.5 text-xs text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber";

export function AdminAccountsTable({ rows: initialRows }: { rows: AdminAccountRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    plan: PlanKey;
    interval: BillingInterval;
    status: string;
  }>({ plan: "essential", interval: "monthly", status: "active" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.restaurants.some((name) => name.toLowerCase().includes(q))
    );
  }, [rows, query]);

  async function cancelSubscription(userId: string) {
    if (!confirm("Cancel this account's subscription? They'll lose the ability to publish menus.")) return;
    setCancellingId(userId);
    const res = await fetch(`/api/admin/users/${userId}/cancel`, { method: "POST" });
    setCancellingId(null);
    if (!res.ok) {
      alert("Could not cancel the subscription.");
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === userId ? { ...r, status: "canceled" } : r)));
  }

  function startEditing(row: AdminAccountRow) {
    setEditingId(row.id);
    setEditForm({
      plan: (row.planKey as PlanKey) ?? "essential",
      interval: row.interval ?? "monthly",
      status: row.status ?? "active",
    });
  }

  async function saveEdit(userId: string) {
    setSavingId(userId);
    const res = await fetch(`/api/admin/users/${userId}/subscription`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setSavingId(null);
    if (!res.ok) {
      alert("Could not update the subscription.");
      return;
    }
    setRows((prev) =>
      prev.map((r) =>
        r.id === userId
          ? {
              ...r,
              planKey: editForm.plan,
              planName: PLANS[editForm.plan].name,
              interval: editForm.interval,
              status: editForm.status,
            }
          : r
      )
    );
    setEditingId(null);
  }

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email or restaurant…"
        className="max-w-sm"
      />

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-panel">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">Restaurants</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Since</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const isActive = r.status === "active" || r.status === "trialing";
              const isEditing = editingId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{r.name}</p>
                      <p className="text-xs text-ink-soft">{r.email}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {r.restaurants.length > 0 ? r.restaurants.join(", ") : "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {r.planName ? `${r.planName}${r.interval ? ` (${r.interval})` : ""}` : "No plan"}
                    </td>
                    <td className="px-4 py-3">
                      {r.status ? (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            STATUS_STYLES[r.status] ?? "bg-ink-soft/10 text-ink-soft"
                          }`}
                        >
                          {r.status}
                        </span>
                      ) : (
                        <span className="text-xs text-ink-soft">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => (isEditing ? setEditingId(null) : startEditing(r))}
                          className="text-xs text-ink-soft hover:text-amber"
                        >
                          {isEditing ? "Close" : "Edit plan"}
                        </button>
                        {isActive && (
                          <button
                            onClick={() => cancelSubscription(r.id)}
                            disabled={cancellingId === r.id}
                            className="text-xs text-ink-soft hover:text-red-600"
                          >
                            {cancellingId === r.id ? "Cancelling…" : "Cancel"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isEditing && (
                    <tr className="border-b border-border bg-paper last:border-0">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="flex flex-wrap items-end gap-3">
                          <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-wide text-ink-soft">
                              Plan
                            </label>
                            <select
                              className={selectClass}
                              value={editForm.plan}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, plan: e.target.value as PlanKey }))
                              }
                            >
                              {PLAN_ORDER.map((key) => (
                                <option key={key} value={key}>
                                  {PLANS[key].name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-wide text-ink-soft">
                              Interval
                            </label>
                            <select
                              className={selectClass}
                              value={editForm.interval}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  interval: e.target.value as BillingInterval,
                                }))
                              }
                            >
                              <option value="monthly">Monthly</option>
                              <option value="annual">Annual</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-wide text-ink-soft">
                              Status
                            </label>
                            <select
                              className={selectClass}
                              value={editForm.status}
                              onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => saveEdit(r.id)}
                            disabled={savingId === r.id}
                            className="rounded-full bg-amber px-4 py-1.5 text-xs font-medium text-navy hover:bg-amber-soft disabled:opacity-50"
                          >
                            {savingId === r.id ? "Saving…" : "Save"}
                          </button>
                        </div>
                        <p className="mt-2 text-[11px] text-ink-soft">
                          This sets our own record directly — it does not create, change, or cancel a
                          real Stripe subscription. Use it to comp a plan or fix a support issue, not
                          to bill a customer.
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No accounts match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
