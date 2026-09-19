"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import { DIETARY_TAGS, DietaryKey, dietaryLabel } from "@/lib/dietary-tags";
import { menuString } from "@/lib/menu-strings";

export function DietaryFilter({
  lang,
  active,
  onToggle,
  onClear,
}: {
  lang: string;
  active: Set<DietaryKey>;
  onToggle: (key: DietaryKey) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="absolute top-4 end-4 z-10">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={menuString("filterLabel", lang)}
        aria-expanded={open}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${
          active.size > 0
            ? "border-amber bg-amber/20 text-amber"
            : "border-paper/25 bg-navy/20 text-paper/85 hover:border-amber hover:text-amber"
        }`}
      >
        <SlidersHorizontal size={16} />
        {active.size > 0 && (
          <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[10px] font-bold text-navy">
            {active.size}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-56 rounded-lg border border-border bg-panel py-1.5 text-left shadow-lg">
          {DIETARY_TAGS.map(({ key, icon: Icon }) => {
            const isActive = active.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggle(key)}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition-colors ${
                  isActive ? "bg-amber/10 text-navy" : "text-ink hover:bg-paper"
                }`}
              >
                <Icon size={15} className="shrink-0 text-green" />
                <span className="flex-1">{dietaryLabel(key, lang)}</span>
                {isActive && <Check size={14} className="text-amber" />}
              </button>
            );
          })}
          {active.size > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="mt-1 w-full border-t border-border px-3.5 py-2 text-left text-xs text-ink-soft hover:text-amber"
            >
              {menuString("clearFilters", lang)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
