"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";

type Item = { id: string; name: string };

export function EstablishmentSwitcher({
  current,
  restaurants,
  canAddMore,
}: {
  current: Item;
  restaurants: Item[];
  canAddMore: boolean;
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

  if (restaurants.length <= 1) {
    return <p className="truncate text-sm text-ink-soft">{current.name}</p>;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-md px-1 py-1 text-sm text-ink-soft hover:text-amber"
      >
        <span className="truncate">{current.name}</span>
        <ChevronDown size={14} className="shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-1 w-56 rounded-lg border border-border bg-panel py-1 shadow-lg">
          {restaurants.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/r/${r.id}`}
              onClick={() => setOpen(false)}
              className={`block truncate px-3 py-2 text-sm hover:bg-paper ${
                r.id === current.id ? "text-amber" : "text-ink"
              }`}
            >
              {r.name}
            </Link>
          ))}
          <div className="mt-1 border-t border-border pt-1">
            {canAddMore ? (
              <Link
                href="/dashboard/new-establishment"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-amber hover:underline"
              >
                <Plus size={14} /> Add establishment
              </Link>
            ) : (
              <Link
                href="/dashboard/billing"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-xs text-ink-soft hover:text-amber"
              >
                Upgrade to add more establishments
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
