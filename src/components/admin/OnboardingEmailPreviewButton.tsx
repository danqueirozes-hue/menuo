"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

/** Admin-only: emails every onboarding-nudge variant to the admin's own inbox. */
export function OnboardingEmailPreviewButton() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function send() {
    setState("sending");
    const res = await fetch("/api/admin/onboarding-email-preview", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setState("done");
      setMessage(`${data.sent} test emails sent to ${data.to}.`);
    } else {
      setState("error");
      setMessage(data.error || "Could not send the test emails.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={send}
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-2 text-sm text-ink hover:border-amber hover:text-amber disabled:opacity-50"
      >
        <Mail size={14} /> {state === "sending" ? "Sending…" : "Send onboarding test emails to me"}
      </button>
      {message && <span className={`text-sm ${state === "error" ? "text-red-600" : "text-green"}`}>{message}</span>}
    </div>
  );
}
