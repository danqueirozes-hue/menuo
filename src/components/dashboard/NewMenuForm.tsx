"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { DashboardDict } from "@/lib/dashboard-content";

export function NewMenuForm({
  restaurantId,
  dict,
}: {
  restaurantId: string;
  dict: DashboardDict["newMenu"];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [lang, setLang] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, name, defaultLanguage: lang }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || dict.error);
      return;
    }

    router.push(`/dashboard/r/${restaurantId}/menus/${data.id}`);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="amber">
        {dict.cta}
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-panel p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{dict.name}</Label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.namePlaceholder}
          />
        </div>
        <div>
          <Label>{dict.language}</Label>
          <select
            required
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full rounded-md border border-border bg-panel px-4 py-2.5 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value="" disabled>
              {dict.selectLanguage}
            </option>
            {dict.languageOptions.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? dict.creating : dict.create}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          {dict.cancel}
        </Button>
      </div>
    </form>
  );
}
