"use client";

import { useEffect } from "react";
import { rememberCampaign, trackFunnel } from "@/lib/funnel";

function ctaPosition(el: Element): string {
  if (el.closest("header")) return "nav";
  if (el.closest("#pricing")) return "plan";
  return el.closest("[data-section]")?.getAttribute("data-section") ?? "other";
}

/** Landing-page funnel tracking + carrying UTM/click ids into signup links.
 * Renders nothing; all listeners are passive and attached after hydration. */
export function FunnelEvents() {
  useEffect(() => {
    // Keep campaign parameters on every signup link (the ads' UTMs must
    // survive the click to the signup page).
    const campaign = rememberCampaign();
    if (campaign) {
      document.querySelectorAll<HTMLAnchorElement>('a[href^="/signup"]').forEach((a) => {
        const url = new URL(a.href);
        new URLSearchParams(campaign).forEach((v, k) => url.searchParams.set(k, v));
        a.href = url.pathname + url.search;
      });
    }

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      const tagged = target.closest("[data-event]");
      if (tagged) {
        trackFunnel(tagged.getAttribute("data-event") as "demo_open" | "whatsapp_click");
        return;
      }
      const signup = target.closest<HTMLAnchorElement>('a[href^="/signup"]');
      if (!signup) return;
      trackFunnel("cta_click", ctaPosition(signup));
      // next/link navigates to its original href prop, not the rewritten one,
      // so navigate ourselves to keep the campaign parameters.
      if (campaign && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
        e.preventDefault();
        e.stopPropagation();
        location.assign(signup.href);
      }
    }

    let videoTracked = false;
    function onPlay(e: Event) {
      if (videoTracked || !(e.target instanceof HTMLVideoElement)) return;
      videoTracked = true;
      trackFunnel("video_play");
    }

    function onToggle(e: Event) {
      const d = e.target;
      if (d instanceof HTMLDetailsElement && d.open && d.closest("#faq")) trackFunnel("faq_open");
    }

    document.addEventListener("click", onClick, { capture: true });
    // play/toggle don't bubble — listen in the capture phase.
    document.addEventListener("play", onPlay, { capture: true });
    document.addEventListener("toggle", onToggle, { capture: true });

    const pricing = document.getElementById("pricing");
    const observer =
      pricing &&
      new IntersectionObserver(
        (entries, obs) => {
          if (entries.some((en) => en.isIntersecting)) {
            trackFunnel("pricing_view");
            obs.disconnect();
          }
        },
        { threshold: 0.3 },
      );
    if (pricing && observer) observer.observe(pricing);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("play", onPlay, { capture: true });
      document.removeEventListener("toggle", onToggle, { capture: true });
      observer?.disconnect();
    };
  }, []);

  return null;
}
