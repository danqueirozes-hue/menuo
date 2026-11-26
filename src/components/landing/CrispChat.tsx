"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { trackFunnel } from "@/lib/funnel";

type CrispWindow = Window & {
  $crisp?: unknown[][];
  CRISP_WEBSITE_ID?: string;
  CRISP_RUNTIME_CONFIG?: { locale?: string };
};

/** Floating "talk to us" button that opens a Crisp live chat.
 *
 * Crisp's script (and its cookies) only load when the visitor clicks, so the
 * chat costs nothing on page load (LCP untouched) and runs only by the
 * visitor's own choice. Crisp's own launcher stays hidden: this button is the
 * way in, and it comes back whenever the chat is closed. */
export function CrispChat({ websiteId, locale, cta, label }: { websiteId: string; locale: string; cta: string; label: string }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    // On phones the label collapses to the round icon after a few seconds,
    // so it doesn't sit on top of the content.
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const t = setTimeout(() => setShowLabel(false), 8000);
    return () => clearTimeout(t);
  }, []);

  function open() {
    const w = window as CrispWindow;
    if (!w.$crisp) {
      w.$crisp = [];
      w.CRISP_WEBSITE_ID = websiteId;
      w.CRISP_RUNTIME_CONFIG = { locale };
      w.$crisp.push(["safe", true]);
      w.$crisp.push([
        "on",
        "chat:closed",
        () => {
          w.$crisp?.push(["do", "chat:hide"]);
          setChatOpen(false);
        },
      ]);
      const s = document.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      document.head.appendChild(s);
    }
    w.$crisp.push(["do", "chat:show"]);
    w.$crisp.push(["do", "chat:open"]);
    setChatOpen(true);
    trackFunnel("chat_open");
  }

  if (chatOpen) return null;

  return (
    <button
      type="button"
      onClick={open}
      onMouseEnter={() => setShowLabel(true)}
      aria-label={`${cta} — ${label}`}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3"
    >
      {showLabel && (
        <span className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-lg shadow-black/10 transition-colors group-hover:text-navy">
          {cta}
        </span>
      )}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-amber text-navy shadow-lg shadow-black/20 transition-transform group-hover:scale-105">
        <MessageCircle size={26} strokeWidth={2.2} />
        <span aria-hidden className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green" />
      </span>
    </button>
  );
}
