"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ClientItem } from "./types";
import { DIET_TAGS, HIGHLIGHT_TAGS, DietaryKey, DietaryFlags } from "@/lib/dietary-tags";
import { ALLERGEN_KEYS, AllergenKey, normalizeAllergens } from "@/lib/allergens";
import { resizeImageForUpload } from "@/lib/resize-image";
import type { BuilderDict } from "@/lib/builder-content";

type VariantDraft = { label: string; price: string };

const MIN_VARIANTS = 2;
const MAX_VARIANTS = 3;

export function ItemEditor({
  initial,
  dict,
  onSave,
  onCancel,
}: {
  initial?: ClientItem;
  dict: BuilderDict;
  onSave: (data: {
    name: string;
    description: string;
    photoUrl?: string;
    hasVariants: boolean;
    price?: number;
    variants: { label: string; price: number }[];
    allergens: AllergenKey[];
    allergensConfirmed: boolean;
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
  const [allergens, setAllergens] = useState<AllergenKey[]>(normalizeAllergens(initial?.allergens ?? []));
  const [allergensConfirmed, setAllergensConfirmed] = useState(initial?.allergensConfirmed ?? false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = dict.editor;

  function toggleDietary(key: DietaryKey) {
    setDietary((d) => ({ ...d, [key]: !d[key] }));
  }

  function toggleAllergen(key: AllergenKey) {
    setAllergens((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : normalizeAllergens([...prev, key])
    );
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
      setError(data.error || t.errorUpload);
      return;
    }
    setPhotoUrl(data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.errorName);
      return;
    }

    let payload: { price?: number; variants: { label: string; price: number }[] };
    if (hasVariants) {
      const cleaned = variants.map((v) => ({
        label: v.label.trim(),
        price: parseFloat(v.price.replace(",", ".")),
      }));
      if (cleaned.length < MIN_VARIANTS || cleaned.some((v) => !v.label || Number.isNaN(v.price))) {
        setError(t.errorOptions.replace("{min}", String(MIN_VARIANTS)));
        return;
      }
      payload = { variants: cleaned };
    } else {
      const parsedPrice = parseFloat(price.replace(",", "."));
      if (Number.isNaN(parsedPrice)) {
        setError(t.errorPrice);
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
        allergens,
        allergensConfirmed,
      });
    } catch {
      setError(t.errorSave);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl bg-panel p-6 shadow-xl">
        <h3 className="font-display text-xl text-ink">
          {initial ? t.titleEdit : t.titleNew}
        </h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <Label>{t.name}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} required />
          </div>
          <div>
            <Label>{t.description}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={3}
            />
          </div>
          <div>
            <Label>{t.allergensTitle}</Label>
            <p className="-mt-1 mb-2 text-xs text-ink-soft">{t.allergensHint}</p>
            <div className="grid grid-cols-2 gap-2">
              {ALLERGEN_KEYS.map((key) => {
                const active = allergens.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleAllergen(key)}
                    aria-pressed={active}
                    className={`rounded-md border px-2 py-2 text-xs transition-colors ${
                      active
                        ? "border-red-300 bg-red-50 font-medium text-red-700"
                        : "border-border text-ink-soft hover:border-amber hover:text-amber"
                    }`}
                  >
                    {active && "✓ "}
                    {dict.allergens[key]}
                  </button>
                );
              })}
              {DIET_TAGS.map(({ key, icon: Icon }) => (
                <ToggleChip
                  key={key}
                  active={dietary[key]}
                  onClick={() => toggleDietary(key)}
                  className="mt-2"
                >
                  <Icon size={14} />
                  {dict.dietary[key]}
                </ToggleChip>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={allergensConfirmed}
                onChange={(e) => setAllergensConfirmed(e.target.checked)}
                className="h-4 w-4 rounded border-border text-amber focus:ring-amber"
              />
              {t.confirmNoOthers}
            </label>
          </div>
          <div>
            <Label>{t.highlights}</Label>
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_TAGS.map(({ key, icon: Icon }) => (
                <ToggleChip key={key} active={dietary[key]} onClick={() => toggleDietary(key)} className="rounded-full px-3">
                  <Icon size={14} />
                  {dict.dietary[key]}
                </ToggleChip>
              ))}
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
              {t.hasVariants}
            </label>

            {!hasVariants ? (
              <div className="mt-3">
                <Label>{t.price}</Label>
                <Input
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={t.pricePlaceholder}
                  required
                />
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <Label>{t.options}</Label>
                {variants.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <Input
                        value={v.label}
                        onChange={(e) => updateVariant(i, "label", e.target.value)}
                        placeholder={t.optionPlaceholder}
                      />
                    </div>
                    <div className="w-20 shrink-0">
                      <Input
                        inputMode="decimal"
                        value={v.price}
                        onChange={(e) => updateVariant(i, "price", e.target.value)}
                        placeholder={t.optionPricePlaceholder}
                      />
                    </div>
                    {variants.length > MIN_VARIANTS && (
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        aria-label={t.removeOption}
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
                    <Plus size={15} /> {t.addOption}
                  </button>
                )}
              </div>
            )}
          </div>
          <div>
            <Label>{t.photo}</Label>
            <div className="flex items-center gap-4">
              {photoUrl && (
                <Image
                  src={photoUrl}
                  alt={t.photoAlt}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-md object-cover"
                />
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="text-sm" />
            </div>
            {uploading && <p className="mt-1 text-xs text-ink-soft">{t.uploading}</p>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? t.saving : t.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  className = "",
  children,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs transition-colors ${className} ${
        active
          ? "border-amber bg-amber/15 text-navy"
          : "border-border text-ink-soft hover:border-amber hover:text-amber"
      }`}
    >
      {children}
    </button>
  );
}
