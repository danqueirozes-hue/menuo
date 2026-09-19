"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionEditor } from "./SectionEditor";
import { ClientSection, ClientItem } from "./types";

export function SortableSection({
  section,
  ...rest
}: {
  section: ClientSection;
  currency: string;
  onRename: (name: string) => void;
  onDelete: () => void;
  onReorderItems: (items: ClientItem[]) => void;
  onAddItem: () => void;
  onEditItem: (item: ClientItem) => void;
  onDeleteItem: (item: ClientItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionEditor section={section} dragHandleProps={{ ...attributes, ...listeners }} {...rest} />
    </div>
  );
}
