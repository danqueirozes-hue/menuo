"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SectionEditor } from "./SectionEditor";
import { ItemEditor } from "./ItemEditor";
import { ClientSection, ClientItem, SECTION_SUGGESTIONS } from "./types";
import { DietaryFlags } from "@/lib/dietary-tags";

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export function MenuBuilder({
  menuId,
  initialSections,
  currency,
}: {
  menuId: string;
  initialSections: ClientSection[];
  currency: string;
}) {
  const [sections, setSections] = useState<ClientSection[]>(initialSections);
  const [newSectionName, setNewSectionName] = useState("");
  const [itemEditor, setItemEditor] = useState<{ sectionId: string; item?: ClientItem } | null>(
    null
  );

  async function addSection(name: string) {
    if (!name.trim()) return;
    const created = await api<ClientSection>("/api/sections", {
      method: "POST",
      body: JSON.stringify({ menuId, name: name.trim() }),
    });
    setSections((prev) => [...prev, { ...created, items: [] }]);
    setNewSectionName("");
  }

  async function renameSection(id: string, name: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
    await api(`/api/sections/${id}`, { method: "PATCH", body: JSON.stringify({ name }) });
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section and all its dishes?")) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
    await api(`/api/sections/${id}`, { method: "DELETE" });
  }

  async function moveSection(id: string, direction: "up" | "down") {
    const index = sections.findIndex((s) => s.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= sections.length) return;

    const next = [...sections];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    setSections(next);

    await Promise.all([
      api(`/api/sections/${next[index].id}`, {
        method: "PATCH",
        body: JSON.stringify({ position: index }),
      }),
      api(`/api/sections/${next[swapWith].id}`, {
        method: "PATCH",
        body: JSON.stringify({ position: swapWith }),
      }),
    ]);
  }

  async function saveItem(
    sectionId: string,
    existing: ClientItem | undefined,
    data: { name: string; description: string; price: number; photoUrl?: string } & DietaryFlags
  ) {
    if (existing) {
      const updated = await api<ClientItem>(`/api/items/${existing.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.map((i) => (i.id === existing.id ? updated : i)) }
            : s
        )
      );
    } else {
      const created = await api<ClientItem>("/api/items", {
        method: "POST",
        body: JSON.stringify({ sectionId, ...data }),
      });
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, created] } : s))
      );
    }
    setItemEditor(null);
  }

  async function deleteItem(sectionId: string, item: ClientItem) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== item.id) } : s
      )
    );
    await api(`/api/items/${item.id}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <SectionEditor
          key={section.id}
          section={section}
          currency={currency}
          canMoveUp={index > 0}
          canMoveDown={index < sections.length - 1}
          onRename={(name) => renameSection(section.id, name)}
          onDelete={() => deleteSection(section.id)}
          onMove={(direction) => moveSection(section.id, direction)}
          onAddItem={() => setItemEditor({ sectionId: section.id })}
          onEditItem={(item) => setItemEditor({ sectionId: section.id, item })}
          onDeleteItem={(item) => deleteItem(section.id, item)}
        />
      ))}

      <div className="rounded-xl border border-dashed border-border p-6">
        <p className="text-sm font-medium text-ink">Add a new section</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SECTION_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => addSection(s)}
              className="rounded-full border border-border px-3 py-1 text-xs text-ink-soft hover:border-amber hover:text-amber"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <Input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Custom section name"
            onKeyDown={(e) => e.key === "Enter" && addSection(newSectionName)}
          />
          <Button variant="outline" onClick={() => addSection(newSectionName)}>
            <Plus size={16} /> Add
          </Button>
        </div>
      </div>

      {itemEditor && (
        <ItemEditor
          initial={itemEditor.item}
          onCancel={() => setItemEditor(null)}
          onSave={(data) => saveItem(itemEditor.sectionId, itemEditor.item, data)}
        />
      )}
    </div>
  );
}
