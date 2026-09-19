"use client";

import { useState } from "react";
import Image from "next/image";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Restaurant = {
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  currency: string;
  accentColor: string;
  logoUrl: string | null;
};

export function SettingsForm({ restaurantId, restaurant }: { restaurantId: string; restaurant: Restaurant }) {
  const [form, setForm] = useState({
    name: restaurant.name,
    address: restaurant.address ?? "",
    city: restaurant.city ?? "",
    country: restaurant.country ?? "",
    currency: restaurant.currency,
    accentColor: restaurant.accentColor,
    logoUrl: restaurant.logoUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (res.ok) update("logoUrl", data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/restaurants/${restaurantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <Label>Restaurant name</Label>
        <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
      </div>

      <div>
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          {form.logoUrl && (
            <Image src={form.logoUrl} alt="Logo" width={56} height={56} className="h-14 w-14 rounded-md object-cover" />
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} className="text-sm" />
        </div>
        {uploading && <p className="mt-1 text-xs text-ink-soft">Uploading…</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => update("address", e.target.value)} />
        </div>
        <div>
          <Label>City</Label>
          <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
        </div>
        <div>
          <Label>Country</Label>
          <Input value={form.country} onChange={(e) => update("country", e.target.value)} />
        </div>
        <div>
          <Label>Currency (ISO code)</Label>
          <Input
            value={form.currency}
            maxLength={3}
            onChange={(e) => update("currency", e.target.value.toUpperCase())}
            placeholder="EUR"
          />
        </div>
      </div>

      <div>
        <Label>Accent color</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={form.accentColor}
            onChange={(e) => update("accentColor", e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-border bg-panel"
          />
          <span className="text-sm text-ink-soft">{form.accentColor}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {saved && <span className="text-sm text-green">Saved</span>}
      </div>
    </form>
  );
}
