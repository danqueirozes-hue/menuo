"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical, Pencil, Trash2, ImageOff } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { ClientItem } from "./types";
import { DIETARY_TAGS } from "@/lib/dietary-tags";

export function SortableItem({
  item,
  currency,
  onEdit,
  onDelete,
}: {
  item: ClientItem;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 py-4">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded p-1 text-ink-soft/50 hover:text-ink-soft active:cursor-grabbing"
        aria-label="Drag to reorder dish"
      >
        <GripVertical size={16} />
      </button>

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
      {item.hasVariants && item.variants.length > 0 ? (
        <div className="text-right">
          <p className="font-display text-sm text-amber">
            {formatPrice(Math.min(...item.variants.map((v) => v.priceCents)), currency)}
            {" – "}
            {formatPrice(Math.max(...item.variants.map((v) => v.priceCents)), currency)}
          </p>
          <p className="text-[10px] text-ink-soft">{item.variants.length} options</p>
        </div>
      ) : (
        <p className="font-display text-sm text-amber">{formatPrice(item.priceCents, currency)}</p>
      )}
      <div className="flex items-center gap-1 text-ink-soft">
        <button
          onClick={onEdit}
          className="rounded p-1.5 hover:bg-paper hover:text-amber"
          aria-label="Edit dish"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="rounded p-1.5 hover:bg-paper hover:text-red-600"
          aria-label="Delete dish"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
