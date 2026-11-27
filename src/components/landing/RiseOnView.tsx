"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Reveals its children's `.rise-item` elements the first time the block
 * scrolls into view (the motion lives in globals.css; reduced-motion users get
 * them already in place). Without JS the items simply show. */
export function RiseOnView({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    el.dataset.rise = "waiting";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.rise = "shown";
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
