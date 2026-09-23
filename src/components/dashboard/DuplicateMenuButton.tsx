"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";

export function DuplicateMenuButton({
  menuId,
  restaurantId,
  disabled,
}: {
  menuId: string;
  restaurantId: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function duplicate(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || loading) return;

    setLoading(true);
    setError(null);
    const res = await fetch(`/api/menus/${menuId}/duplicate`, { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not duplicate the menu.");
      return;
    }

    router.push(`/dashboard/r/${restaurantId}/menus/${data.id}`);
  }

  return (
    <div className="relative">
      <button
        onClick={duplicate}
        disabled={disabled || loading}
        title={disabled ? "Upgrade your plan to duplicate menus" : "Duplicate this menu"}
        aria-label="Duplicate menu"
        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-soft transition-colors hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-soft"
      >
        <Copy size={13} /> {loading ? "Duplicating…" : "Duplicate"}
      </button>
      {error && <p className="absolute right-0 top-full mt-1 whitespace-nowrap text-xs text-red-600">{error}</p>}
    </div>
  );
}
