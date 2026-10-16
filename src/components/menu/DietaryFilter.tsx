"use client";

import { useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { DIET_TAGS, DietaryKey, dietaryLabel } from "@/lib/dietary-tags";
import { ALLERGEN_KEYS, AllergenKey, allergenLabels } from "@/lib/allergens";
import { menuString } from "@/lib/menu-strings";

/** Labeled pill that opens the allergy sheet. Lives as the first item of the
 * sticky section nav so it stays reachable while the guest scrolls. */
export function FilterTrigger({
  lang,
  activeCount,
  onOpen,
}: {
  lang: string;
  activeCount: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        activeCount > 0
          ? "border-red-300 bg-red-50 font-medium text-red-700"
          : "border-navy/30 text-navy hover:border-amber hover:text-amber"
      }`}
    >
      <SlidersHorizontal size={15} className="shrink-0" />
      {menuString("triggerLabel", lang)}
      {activeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
          {activeCount}
        </span>
      )}
    </button>
  );
}

/** Bottom sheet (centered dialog on wider screens) where the guest picks
 * allergens to avoid and, optionally, vegetarian/vegan only. Rendered at the
 * page root, above every sticky element. Filtering applies live; the footer
 * button just closes the sheet and shows how many dishes remain. */
export function FilterSheet({
  lang,
  open,
  avoid,
  only,
  visibleCount,
  onToggleAllergen,
  onToggleDiet,
  onClear,
  onClose,
}: {
  lang: string;
  open: boolean;
  avoid: Set<AllergenKey>;
  only: Set<DietaryKey>;
  visibleCount: number;
  onToggleAllergen: (key: AllergenKey) => void;
  onToggleDiet: (key: DietaryKey) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const labels = allergenLabels(lang);
  const activeCount = avoid.size + only.size;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={menuString("sheetTitle", lang)}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-md flex-col rounded-t-2xl bg-panel shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg text-ink">{menuString("sheetTitle", lang)}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-paper hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <p className="mb-2.5 text-sm text-ink-soft">{menuString("avoidPrompt", lang)}</p>
          <div className="grid grid-cols-2 gap-2">
            {ALLERGEN_KEYS.map((key) => {
              const active = avoid.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onToggleAllergen(key)}
                  aria-pressed={active}
                  className={`rounded-lg border px-2 py-2.5 text-sm transition-colors ${
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

          <p className="mb-2.5 mt-5 text-sm text-ink-soft">{menuString("onlyPrompt", lang)}</p>
          <div className="grid grid-cols-2 gap-2">
            {DIET_TAGS.map(({ key, icon: Icon }) => {
              const active = only.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onToggleDiet(key)}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-sm transition-colors ${
                    active
                      ? "border-green bg-green/10 font-medium text-green"
                      : "border-border text-ink hover:border-amber hover:text-amber"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  {dietaryLabel(key, lang)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 text-sm text-ink-soft underline-offset-2 hover:text-amber hover:underline"
            >
              {menuString("clearFilters", lang)}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-medium text-paper hover:bg-navy-soft"
          >
            {menuString("showDishes", lang).replace("{count}", String(visibleCount))}
          </button>
        </div>
      </div>
    </div>
  );
}
