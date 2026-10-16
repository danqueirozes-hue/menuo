"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function SectionNav({
  sections,
  activeId,
  onSelect,
  leading,
}: {
  sections: { id: string; label: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
  /** Pinned first item that doesn't scroll with the pills (the allergy filter button). */
  leading?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // As the guest scrolls the page and a new section becomes active, keep
  // its pill scrolled into view too — otherwise on a long menu the
  // highlighted pill can drift off-screen in the nav strip itself.
  useEffect(() => {
    if (!activeId || !containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLElement>(`[data-section-id="${activeId}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  const showSections = sections.length >= 2;
  if (!showSections && !leading) return null;

  return (
    <nav
      aria-label="Menu sections"
      className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-paper/95 px-4 py-3 backdrop-blur"
    >
      {leading}
      {leading && showSections && <span aria-hidden className="h-6 w-px shrink-0 bg-border" />}
      {showSections && (
        <div
          ref={containerRef}
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              data-section-id={s.id}
              onClick={() => onSelect(s.id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
                activeId === s.id
                  ? "border-amber bg-amber font-medium text-navy"
                  : "border-border text-ink-soft hover:border-amber hover:text-amber"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
