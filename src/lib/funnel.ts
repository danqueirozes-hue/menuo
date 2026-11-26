/** Funnel events — the same names in every locale:
 * demo_open, video_play, pricing_view, faq_open, whatsapp_click,
 * cta_click (with its position: nav | hero | plan | final), signup_start,
 * signup_complete.
 *
 * Each one goes to two places:
 *  - window.dataLayer, for GTM/Google Ads. GTM only loads after cookie
 *    consent, so without consent these never leave the browser.
 *  - MENUO's own anonymous analytics (no cookies, no visitor id), so the
 *    admin funnel works for every visitor. */
export type FunnelEvent =
  | "demo_open"
  | "video_play"
  | "pricing_view"
  | "faq_open"
  | "whatsapp_click"
  | "chat_open"
  | "cta_click"
  | "signup_start"
  | "signup_complete";

export const FUNNEL_EVENTS: FunnelEvent[] = [
  "demo_open",
  "video_play",
  "pricing_view",
  "faq_open",
  "whatsapp_click",
  "chat_open",
  "cta_click",
  "signup_start",
  "signup_complete",
];

const LAB_UA = /Lighthouse|Speed Insights|HeadlessChrome|PTST|bot|crawler|spider/i;

export function trackFunnel(name: FunnelEvent, detail?: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...(detail ? { position: detail } : {}) });

  if (navigator.webdriver || LAB_UA.test(navigator.userAgent)) return;
  const body = JSON.stringify({ type: "event", path: location.pathname, metricName: name, linkLabel: detail });
  if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
  else fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

/** Campaign parameters carried from the landing page to signup. */
const CAMPAIGN_KEYS = /^(utm_[a-z]+|gclid|gbraid|wbraid|fbclid)$/;
const CAMPAIGN_STORAGE = "menuo_campaign";

export function rememberCampaign(): string {
  let params = "";
  try {
    const current = new URLSearchParams(location.search);
    const kept = new URLSearchParams();
    current.forEach((v, k) => CAMPAIGN_KEYS.test(k) && kept.set(k, v));
    params = kept.toString();
    if (params) sessionStorage.setItem(CAMPAIGN_STORAGE, params);
    else params = sessionStorage.getItem(CAMPAIGN_STORAGE) ?? "";
  } catch {}
  return params;
}
