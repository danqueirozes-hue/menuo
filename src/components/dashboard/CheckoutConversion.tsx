"use client";

import { useEffect } from "react";

const REPORTED_KEY = "menuo_checkout_conversion_reported";

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

/** Fires the Google Ads purchase conversion once when the customer lands on
 * the post-checkout confirmation page. A sessionStorage flag stops a refresh
 * from counting the same checkout twice. Does nothing until
 * NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL is set — a URL-based conversion on
 * /dashboard/billing/confirmado works without it. */
export function CheckoutConversion() {
  useEffect(() => {
    const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
    if (!label) return;
    try {
      if (sessionStorage.getItem(REPORTED_KEY)) return;
      sessionStorage.setItem(REPORTED_KEY, "1");
    } catch {
      // Storage blocked (private mode): report anyway.
    }
    // The Google tag loads afterInteractive, so gtag() may not exist yet.
    // Define it the same way Google's snippet does; queued events are
    // processed once gtag.js loads.
    const w = window as GtagWindow;
    w.dataLayer = w.dataLayer || [];
    w.gtag =
      w.gtag ||
      function () {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
    w.gtag("event", "conversion", { send_to: `AW-18333271816/${label}` });
  }, []);

  return null;
}
