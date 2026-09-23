import { ChefHat, UtensilsCrossed } from "lucide-react";

export function TranslationProgress({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <ChefHat size={14} /> Bringing your menu to the table…
        </span>
        <span className="font-medium text-ink">{clamped}%</span>
      </div>
      <div className="relative mt-2 h-3 rounded-full border border-border bg-paper">
        <div
          className="h-full rounded-full bg-amber/40 transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-amber transition-[left] duration-500 ease-out"
          style={{ left: `${clamped}%` }}
        >
          <UtensilsCrossed size={18} className="drop-shadow-sm" />
        </div>
      </div>
    </div>
  );
}
