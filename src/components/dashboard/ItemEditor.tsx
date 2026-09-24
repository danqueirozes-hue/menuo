"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ClientItem } from "./types";
import { DIETARY_TAGS, DietaryKey, DietaryFlags } from "@/lib/dietary-tags";
import { resizeImageForUpload } from "@/lib/resize-image";

type VariantDraft = { label: string; price: string };

const MIN_VARIANTS = 2;
const MAX_VARIANTS = 3;

export function ItemEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ClientItem;
  onSave: (data: {
    name: string;
    description: string;
    photoUrl?: string;
    hasVariants: boolean;
    price?: number;
    variants: { label: string; price: number }[];
  } & DietaryFlags) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(
    initial ? (initial.priceCents / 100).toFixed(2) : ""
  );
  const [hasVariants, setHasVariants] = useState(initial?.hasVariants ?? false);
  const [variants, setVariants] = useState<VariantDraft[]>(
    initial?.variants.length
      ? initial.variants.map((v) => ({ label: v.label, price: (v.priceCents / 100).toFixed(2) }))
      : [
          { label: "", price: "" },
          { label: "", price: "" },
        ]
  );
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? "");
  const [dietary, setDietary] = useState<DietaryFlags>({
    isVegetarian: initial?.isVegetarian ?? false,
    isVegan: initial?.isVegan ?? false,
    isGlutenFree: initial?.isGlutenFree ?? false,
    hasSeafood: initial?.hasSeafood ?? false,
    isSpecialty: initial?.isSpecialty ?? false,
    isNew: initial?.isNew ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleDietary(key: DietaryKey) {
    setDietary((d) => ({ ...d, [key]: !d[key] }));
  }

  function updateVariant(index: number, field: keyof VariantDraft, value: string) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }

  function addVariant() {
    setVariants((prev) => (prev.length >= MAX_VARIANTS ? prev : [...prev, { label: "", price: "" }]));
  }

  function removeVariant(index: number) {
    setVariants((prev) => (prev.length <= MIN_VARIANTS ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const resized = await resizeImageForUpload(file);
    const formData = new FormData();
    formData.append("file", resized);
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
    if (!name.trim()) {
      setError("Please provide a dish name.");
      return;
    }

    let payload: { price?: number; variants: { label: string; price: number }[] };
    if (hasVariants) {
      const cleaned = variants.map((v) => ({
        label: v.label.trim(),
        price: parseFloat(v.price.replace(",", ".")),
      }));
      if (cleaned.length < MIN_VARIANTS || cleaned.some((v) => !v.label || Number.isNaN(v.price))) {
        setError(`Add a name and a valid price for at least ${MIN_VARIANTS} options.`);
        return;
      }
      payload = { variants: cleaned };
    } else {
      const parsedPrice = parseFloat(price.replace(",", "."));
      if (Number.isNaN(parsedPrice)) {
        setError("Please provide a valid price.");
        return;
      }
      payload = { price: parsedPrice, variants: [] };
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        photoUrl,
        hasVariants,
        ...payload,
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
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className="h-4 w-4 rounded border-border text-amber focus:ring-amber"
              />
              This dish has price variations (e.g. sizes)?
            </label>

            {!hasVariants ? (
              <div className="mt-3">
                <Label>Price</Label>
                <Input
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="18.50"
                  required
                />
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <Label>Options (2 to 3)</Label>
                {variants.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={v.label}
                      onChange={(e) => updateVariant(i, "label", e.target.value)}
                      placeholder="e.g. Small"
                      className="flex-1"
                    />
                    <Input
                      inputMode="decimal"
                      value={v.price}
                      onChange={(e) => updateVariant(i, "price", e.target.value)}
                      placeholder="12.00"
                      className="w-28"
                    />
                    {variants.length > MIN_VARIANTS && (
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        aria-label="Remove option"
                        className="rounded p-1.5 text-ink-soft hover:bg-paper hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {variants.length < MAX_VARIANTS && (
                  <button
                    type="button"
                    onClick={addVariant}
                    className="inline-flex items-center gap-1.5 text-sm text-amber hover:underline"
                  >
                    <Plus size={15} /> Add another option
                  </button>
                )}
              </div>
            )}
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
