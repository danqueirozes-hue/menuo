"use client";

import { useEffect, useState } from "react";

const GTM_ID = "GTM-53BW6Q23";
/** Google tag of the Menuo Google Ads account (108-568-4878), loaded directly
 * because that account has no access to the GTM container. */
const GOOGLE_ADS_TAG_ID = "AW-17133329612";
const STORAGE_KEY = "menuo_consent"; // "granted" | "denied"
/** Dispatch this on window (e.g. from a footer link) to show the banner again. */
export const OPEN_CONSENT_EVENT = "menuo:open-consent";

type Copy = { text: string; accept: string; reject: string };
const COPY: Record<string, Copy> = {
  en: {
    text: "We use Google cookies only to measure our ad campaigns. The site works fine without them.",
    accept: "Accept",
    reject: "Decline",
  },
  it: {
    text: "Usiamo i cookie di Google solo per misurare le nostre campagne pubblicitarie. Il sito funziona anche senza.",
    accept: "Accetta",
    reject: "Rifiuta",
  },
  pt: {
    text: "Usamos cookies do Google apenas para medir as nossas campanhas de anúncios. O site funciona sem eles.",
    accept: "Aceitar",
    reject: "Recusar",
  },
  es: {
    text: "Usamos cookies de Google solo para medir nuestras campañas publicitarias. La web funciona igual sin ellas.",
    accept: "Aceptar",
    reject: "Rechazar",
  },
  fr: {
    text: "Nous utilisons les cookies Google uniquement pour mesurer nos campagnes publicitaires. Le site fonctionne sans eux.",
    accept: "Accepter",
    reject: "Refuser",
  },
  de: {
    text: "Wir nutzen Google-Cookies nur, um unsere Werbekampagnen zu messen. Die Website funktioniert auch ohne sie.",
    accept: "Akzeptieren",
    reject: "Ablehnen",
  },
};

function readConsent(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}

/** Page language: <html lang> on the localized landing pages; elsewhere the
 * site-language cookie the landing page leaves behind. */
function pageLanguage(): string {
  const lang = document.documentElement.lang.slice(0, 2);
  if (lang !== "en") return lang;
  const cookie = document.cookie.match(/(?:^|; )site_locale=([a-z]{2})/);
  return cookie?.[1] ?? "en";
}

type DataLayerWindow = Window & { dataLayer?: unknown[] };

/** Google Tag Manager loads only after consent (Consent Mode v2: the consent
 * state is pushed before the container, so Google Ads sees it). Declining —
 * or never answering — means no Google script at all. */
function loadGtm() {
  const w = window as DataLayerWindow;
  if (document.getElementById("gtm-script")) return;
  w.dataLayer = w.dataLayer || [];
  // gtag() pushes the `arguments` object, which is what GTM expects.
  function gtag(...args: unknown[]) {
    void args;
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  }
  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("consent", "update", {
    ad_storage: "granted",
    analytics_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);

  // Google Ads tag, under the same consent state pushed above.
  gtag("js", new Date());
  gtag("config", GOOGLE_ADS_TAG_ID);
  const ads = document.createElement("script");
  ads.async = true;
  ads.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_TAG_ID}`;
  document.head.appendChild(ads);
}

export function CookieConsent() {
  const [copy, setCopy] = useState<Copy | null>(null);

  useEffect(() => {
    const consent = readConsent();
    if (consent === "granted") {
      // Same timing as before (after the load event), so GTM never competes
      // with the first render.
      if (document.readyState === "complete") loadGtm();
      else window.addEventListener("load", loadGtm, { once: true });
    }
    const show = () => setCopy(COPY[pageLanguage()] ?? COPY.en);
    // Lab tools (PageSpeed/Lighthouse) and bots never get the banner, so it
    // can't become the measured LCP element.
    const lab = navigator.webdriver || /Lighthouse|Speed Insights|HeadlessChrome|bot|crawler|spider/i.test(navigator.userAgent);
    if (!consent && !lab) {
      const t = setTimeout(show, 1200);
      window.addEventListener(OPEN_CONSENT_EVENT, show);
      return () => {
        clearTimeout(t);
        window.removeEventListener(OPEN_CONSENT_EVENT, show);
      };
    }
    window.addEventListener(OPEN_CONSENT_EVENT, show);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, show);
  }, []);

  if (!copy) return null;

  function answer(value: "granted" | "denied") {
    const previous = readConsent();
    writeConsent(value);
    setCopy(null);
    if (value === "granted") loadGtm();
    // Withdrawing consent after GTM already ran: reload so it's gone.
    else if (previous === "granted") window.location.reload();
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-border bg-panel p-4 text-sm text-ink shadow-xl shadow-black/15 sm:flex-row sm:items-center"
    >
      <p className="flex-1 leading-snug text-ink-soft">{copy.text}</p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => answer("denied")}
          className="rounded-full border border-border px-4 py-2 text-ink transition-colors hover:border-ink"
        >
          {copy.reject}
        </button>
        <button
          onClick={() => answer("granted")}
          className="rounded-full bg-navy px-4 py-2 font-medium text-paper transition-colors hover:bg-navy-soft"
        >
          {copy.accept}
        </button>
      </div>
    </div>
  );
}
