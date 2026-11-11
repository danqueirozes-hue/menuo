"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import type { DashboardDict } from "@/lib/dashboard-content";

export function DuplicateMenuButton({
  menuId,
  restaurantId,
  disabled,
  dict,
}: {
  menuId: string;
  restaurantId: string;
  disabled: boolean;
  dict: DashboardDict["menus"];
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
      setError(data.error || dict.duplicateError);
      return;
    }

    router.push(`/dashboard/r/${restaurantId}/menus/${data.id}`);
  }

  return (
    <div className="relative">
      <button
        onClick={duplicate}
        disabled={disabled || loading}
        title={disabled ? dict.duplicateDisabledTitle : dict.duplicateTitle}
        aria-label={dict.duplicateTitle}
        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-soft transition-colors hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-soft"
      >
        <Copy size={13} /> {loading ? dict.duplicating : dict.duplicate}
      </button>
      {error && <p className="absolute right-0 top-full mt-1 whitespace-nowrap text-xs text-red-600">{error}</p>}
    </div>
  );
}
