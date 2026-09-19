"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, ChevronUp, ChevronDown, ImageOff } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { ClientSection, ClientItem } from "./types";
import { DIETARY_TAGS } from "@/lib/dietary-tags";

export function SectionEditor({
  section,
  currency,
  canMoveUp,
  canMoveDown,
  onRename,
  onDelete,
  onMove,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: {
  section: ClientSection;
  currency: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onRename: (name: string) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  onAddItem: () => void;
  onEditItem: (item: ClientItem) => void;
  onDeleteItem: (item: ClientItem) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(section.name);

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="flex items-center justify-between gap-3">
        {editingName ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              if (name.trim() && name !== section.name) onRename(name.trim());
              else setName(section.name);
            }}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="font-display border-b border-amber bg-transparent text-xl text-ink focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="font-display text-xl text-ink hover:text-amber"
          >
            {section.name}
          </button>
        )}

        <div className="flex items-center gap-1 text-ink-soft">
          <button
            onClick={() => onMove("up")}
            disabled={!canMoveUp}
            className="rounded p-1.5 hover:bg-paper hover:text-amber disabled:opacity-30"
            aria-label="Move section up"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={!canMoveDown}
            className="rounded p-1.5 hover:bg-paper hover:text-amber disabled:opacity-30"
            aria-label="Move section down"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1.5 hover:bg-paper hover:text-red-600"
            aria-label="Delete section"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 divide-y divide-border">
        {section.items.length === 0 && (
          <p className="py-4 text-sm text-ink-soft">No dishes yet in this section.</p>
        )}
        {section.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4">
            {item.photoUrl ? (
              <Image
                src={item.photoUrl}
                alt={item.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-paper text-ink-soft/40">
                <ImageOff size={20} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                {DIETARY_TAGS.filter((t) => item[t.key]).map(({ key, label, icon: Icon }) => (
                  <Icon key={key} size={13} className="text-green" aria-label={label}>
                    <title>{label}</title>
                  </Icon>
                ))}
              </div>
              {item.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">{item.description}</p>
              )}
            </div>
            <p className="font-display text-sm text-amber">
              {formatPrice(item.priceCents, currency)}
            </p>
            <div className="flex items-center gap-1 text-ink-soft">
              <button
                onClick={() => onEditItem(item)}
                className="rounded p-1.5 hover:bg-paper hover:text-amber"
                aria-label="Edit dish"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDeleteItem(item)}
                className="rounded p-1.5 hover:bg-paper hover:text-red-600"
                aria-label="Delete dish"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddItem}
        className="mt-4 inline-flex items-center gap-2 text-sm text-amber hover:underline"
      >
        <Plus size={16} /> Add a dish
      </button>
    </div>
  );
}
