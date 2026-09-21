"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";

export type AdminAccountRow = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  restaurants: string[];
  planName: string | null;
  interval: "monthly" | "annual" | null;
  status: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green/15 text-green",
  trialing: "bg-green/15 text-green",
  past_due: "bg-amber/15 text-amber",
  incomplete: "bg-ink-soft/10 text-ink-soft",
  canceled: "bg-red-50 text-red-600",
};

export function AdminAccountsTable({ rows: initialRows }: { rows: AdminAccountRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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
              return (
                <tr key={r.id} className="border-b border-border last:border-0">
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
                    {isActive && (
                      <button
                        onClick={() => cancelSubscription(r.id)}
                        disabled={cancellingId === r.id}
                        className="text-xs text-ink-soft hover:text-red-600"
                      >
                        {cancellingId === r.id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
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
