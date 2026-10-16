"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { DIET_TAGS, DietaryKey, dietaryLabel } from "@/lib/dietary-tags";
import { ALLERGEN_KEYS, AllergenKey, allergenLabels } from "@/lib/allergens";
import { menuString } from "@/lib/menu-strings";

/** Guest-side filter: hide dishes containing any allergen the guest must
 * avoid, and optionally show only vegetarian/vegan dishes. Mirrors the
 * owner's editor layout (14 allergens in two columns, diet row below). */
export function DietaryFilter({
  lang,
  avoid,
  only,
  onToggleAllergen,
  onToggleDiet,
  onClear,
}: {
  lang: string;
  avoid: Set<AllergenKey>;
  only: Set<DietaryKey>;
  onToggleAllergen: (key: AllergenKey) => void;
  onToggleDiet: (key: DietaryKey) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const labels = allergenLabels(lang);
  const activeCount = avoid.size + only.size;

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
          activeCount > 0
            ? "border-amber bg-amber/20 text-amber"
            : "border-paper/25 bg-navy/20 text-paper/85 hover:border-amber hover:text-amber"
        }`}
      >
        <SlidersHorizontal size={16} />
        {activeCount > 0 && (
          <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[10px] font-bold text-navy">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 mt-2 max-h-[75vh] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-border bg-panel p-3.5 text-start shadow-lg">
          <p className="mb-2 text-xs text-ink-soft">{menuString("avoidPrompt", lang)}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {ALLERGEN_KEYS.map((key) => {
              const active = avoid.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onToggleAllergen(key)}
                  aria-pressed={active}
                  className={`rounded-md border px-2 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-red-300 bg-red-50 font-medium text-red-700"
                      : "border-border text-ink hover:border-amber hover:text-amber"
                  }`}
                >
                  {active && "✕ "}
                  {labels[key]}
                </button>
              );
            })}
          </div>

          <p className="mb-2 mt-4 text-xs text-ink-soft">{menuString("onlyPrompt", lang)}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {DIET_TAGS.map(({ key, icon: Icon }) => {
              const active = only.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onToggleDiet(key)}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-green bg-green/10 font-medium text-green"
                      : "border-border text-ink hover:border-amber hover:text-amber"
                  }`}
                >
                  <Icon size={13} className="shrink-0" />
                  {dietaryLabel(key, lang)}
                </button>
              );
            })}
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="mt-3 w-full border-t border-border pt-2.5 text-start text-xs text-ink-soft hover:text-amber"
            >
              {menuString("clearFilters", lang)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
