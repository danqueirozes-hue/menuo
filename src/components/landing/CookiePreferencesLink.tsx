"use client";

import { OPEN_CONSENT_EVENT } from "@/components/CookieConsent";

/** Reopens the cookie banner so a visitor can change their answer. */
export function CookiePreferencesLink({ label }: { label: string }) {
  return (
    <button onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="hover:text-amber">
      {label}
    </button>
  );
}
