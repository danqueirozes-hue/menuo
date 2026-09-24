"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteMenuButton({ menuId, menuName }: { menuId: string; menuName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    const confirmed = confirm(
      `Delete "${menuName}"? This permanently removes its sections, dishes and QR code. This cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    await fetch(`/api/menus/${menuId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Delete menu"
      aria-label="Delete menu"
      className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-soft transition-colors hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Trash2 size={13} /> {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
