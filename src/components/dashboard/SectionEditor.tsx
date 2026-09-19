"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { ClientSection, ClientItem } from "./types";

export function SectionEditor({
  section,
  currency,
  dragHandleProps,
  onRename,
  onDelete,
  onReorderItems,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: {
  section: ClientSection;
  currency: string;
  dragHandleProps?: Record<string, unknown>;
  onRename: (name: string) => void;
  onDelete: () => void;
  onReorderItems: (items: ClientItem[]) => void;
  onAddItem: () => void;
  onEditItem: (item: ClientItem) => void;
  onDeleteItem: (item: ClientItem) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(section.name);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleItemDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = section.items.findIndex((i) => i.id === active.id);
    const newIndex = section.items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorderItems(arrayMove(section.items, oldIndex, newIndex));
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            {...dragHandleProps}
            className="cursor-grab touch-none rounded p-1 text-ink-soft/50 hover:text-ink-soft active:cursor-grabbing"
            aria-label="Drag to reorder section"
          >
            <GripVertical size={18} />
          </button>
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
        </div>

        <div className="flex items-center gap-1 text-ink-soft">
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
        <DndContext
          id={`items-dnd-${section.id}`}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleItemDragEnd}
        >
          <SortableContext items={section.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {section.items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                currency={currency}
                onEdit={() => onEditItem(item)}
                onDelete={() => onDeleteItem(item)}
              />
            ))}
          </SortableContext>
        </DndContext>
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
