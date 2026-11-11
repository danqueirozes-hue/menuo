"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { DashboardDict } from "@/lib/dashboard-content";

export function DeleteMenuButton({
  menuId,
  menuName,
  dict,
}: {
  menuId: string;
  menuName: string;
  dict: DashboardDict["menus"];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    const confirmed = confirm(dict.deleteConfirm.replace("{name}", menuName));
    if (!confirmed) return;

    setLoading(true);
    await fetch(`/api/menus/${menuId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title={dict.deleteTitle}
      aria-label={dict.deleteTitle}
      className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-soft transition-colors hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Trash2 size={13} /> {loading ? dict.deleting : dict.delete}
    </button>
  );
}
