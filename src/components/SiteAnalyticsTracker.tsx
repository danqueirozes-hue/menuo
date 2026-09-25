"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

const EXCLUDED_PREFIXES = ["/dashboard", "/admin"];

function isExcluded(path: string) {
  return EXCLUDED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

function send(event: Record<string, unknown>) {
  const body = JSON.stringify(event);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
      () => {}
    );
  }
}

function referrerHost(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const ref = new URL(document.referrer);
    return ref.hostname === location.hostname ? undefined : ref.hostname;
  } catch {
    return undefined;
  }
}

/** Fires anonymous pageview/click/performance beacons for the public site.
 * No cookies, no visitor id, no IP stored — see netlify/edge-functions/
 * track-geo.ts and src/app/api/track-ingest/route.ts for what's kept. */
export function SiteAnalyticsTracker() {
  const pathname = usePathname();
  const vitalsWired = useRef(false);

  useEffect(() => {
    if (!pathname || isExcluded(pathname)) return;
    send({ type: "pageview", path: pathname, referrerHost: referrerHost() });
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (isExcluded(location.pathname)) return;
      const link = (e.target as HTMLElement)?.closest("a");
      if (!link || !link.href) return;
      const label = link.textContent?.trim().slice(0, 200) || undefined;
      let href = link.href;
      try {
        const url = new URL(link.href);
        href = url.hostname === location.hostname ? url.pathname : link.href;
      } catch {
        // keep raw href
      }
      send({ type: "click", path: location.pathname, href, linkLabel: label });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (vitalsWired.current || isExcluded(location.pathname)) return;
    vitalsWired.current = true;

    function report(metric: Metric) {
      if (isExcluded(location.pathname)) return;
      send({
        type: "vitals",
        path: location.pathname,
        metricName: metric.name,
        metricValue: metric.value,
      });
    }
    onCLS(report);
    onFCP(report);
    onINP(report);
    onLCP(report);
    onTTFB(report);
  }, []);

  return null;
}
