"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";

/** Admin-only: preview and send the one-off "AI menu import" announcement. */
export function ImportAnnouncementPanel({ recipients }: { recipients: string[] }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function run(mode: "preview" | "send") {
    if (mode === "send" && !confirm(`Send the announcement to:\n\n${recipients.join("\n")}\n\nThis can only be done once.`)) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/announce-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMessage({ ok: false, text: res.status === 409 ? "Already sent — not sent again." : data.error || "Something went wrong." });
      return;
    }
    if (mode === "preview") setMessage({ ok: true, text: `Test email sent to ${data.to.join(", ")}.` });
    else {
      const ok = data.results.filter((r: { ok: boolean }) => r.ok).length;
      setMessage({ ok: ok === data.results.length, text: `Sent to ${ok} of ${data.results.length} restaurants.` });
    }
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <p className="flex items-center gap-2 text-sm font-medium text-ink">
        <Megaphone size={15} /> Announcement: AI menu import (Italian)
      </p>
      <p className="mt-1 text-xs text-ink-soft">Recipients: {recipients.join(", ")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => run("preview")}
          disabled={busy}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-ink hover:border-amber hover:text-amber disabled:opacity-50"
        >
          Send test to me
        </button>
        <button
          onClick={() => run("send")}
          disabled={busy}
          className="rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-paper hover:bg-navy-soft disabled:opacity-50"
        >
          Send to the restaurants
        </button>
      </div>
      {message && <p className={`mt-3 text-sm ${message.ok ? "text-green" : "text-red-600"}`}>{message.text}</p>}
    </div>
  );
}
