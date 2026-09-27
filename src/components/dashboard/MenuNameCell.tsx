"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export function MenuNameCell({
  restaurantId,
  menuId,
  name,
  slug,
}: {
  restaurantId: string;
  menuId: string;
  name: string;
  slug: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [saving, setSaving] = useState(false);

  async function save() {
    const trimmed = value.trim();
    setEditing(false);
    if (!trimmed || trimmed === name) {
      setValue(name);
      return;
    }
    setSaving(true);
    await fetch(`/api/menus/${menuId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    setSaving(false);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex-1">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setValue(name);
              setEditing(false);
            }
          }}
          className="font-display w-full border-b border-amber bg-transparent text-lg text-ink focus:outline-none"
        />
        <p className="text-xs text-ink-soft">/m/{slug}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center gap-2">
      <Link href={`/dashboard/r/${restaurantId}/menus/${menuId}`} className="flex-1">
        <p className="font-display text-lg text-ink">{saving ? "Saving…" : name}</p>
        <p className="text-xs text-ink-soft">/m/{slug}</p>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          setEditing(true);
        }}
        aria-label="Rename menu"
        title="Rename menu"
        className="shrink-0 rounded p-1.5 text-ink-soft hover:bg-paper hover:text-amber"
      >
        <Pencil size={14} />
      </button>
    </div>
  );
}
