"use client";

import { useState } from "react";
import Image from "next/image";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ClientItem } from "./types";
import { DIETARY_TAGS, DietaryKey, DietaryFlags } from "@/lib/dietary-tags";

export function ItemEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ClientItem;
  onSave: (data: {
    name: string;
    description: string;
    price: number;
    photoUrl?: string;
  } & DietaryFlags) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(
    initial ? (initial.priceCents / 100).toFixed(2) : ""
  );
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? "");
  const [dietary, setDietary] = useState<DietaryFlags>({
    isVegetarian: initial?.isVegetarian ?? false,
    isVegan: initial?.isVegan ?? false,
    isGlutenFree: initial?.isGlutenFree ?? false,
    hasSeafood: initial?.hasSeafood ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleDietary(key: DietaryKey) {
    setDietary((d) => ({ ...d, [key]: !d[key] }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    setPhotoUrl(data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedPrice = parseFloat(price.replace(",", "."));
    if (!name.trim() || Number.isNaN(parsedPrice)) {
      setError("Please provide a name and a valid price.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        photoUrl,
        ...dietary,
      });
    } catch {
      setError("Could not save the dish.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-panel p-6 shadow-xl">
        <h3 className="font-display text-xl text-ink">
          {initial ? "Edit dish" : "Add a dish"}
        </h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <Label>Dish name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Truffle risotto" required />
          </div>
          <div>
            <Label>Ingredients / description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Arborio rice, black truffle, parmesan, white wine"
              rows={3}
            />
          </div>
          <div>
            <Label>Dietary info</Label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map(({ key, label, icon: Icon }) => {
                const active = dietary[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleDietary(key)}
                    aria-pressed={active}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      active
                        ? "border-amber bg-amber/15 text-navy"
                        : "border-border text-ink-soft hover:border-amber hover:text-amber"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label>Price</Label>
            <Input
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="18.50"
              required
            />
          </div>
          <div>
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              {photoUrl && (
                <Image
                  src={photoUrl}
                  alt="Dish preview"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-md object-cover"
                />
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="text-sm" />
            </div>
            {uploading && <p className="mt-1 text-xs text-ink-soft">Uploading…</p>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? "Saving…" : "Save dish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
