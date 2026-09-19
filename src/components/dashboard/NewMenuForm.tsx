"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LANGUAGES } from "@/lib/languages";

export function NewMenuForm({ restaurantId }: { restaurantId: string }) {
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
      setError(data.error || "Could not create the menu.");
      return;
    }

    router.push(`/dashboard/r/${restaurantId}/menus/${data.id}`);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="bg-amber text-navy hover:bg-amber-soft">
        + New menu
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-panel p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Menu name</Label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lunch Menu"
          />
        </div>
        <div>
          <Label>Language it's written in</Label>
          <select
            required
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full rounded-md border border-border bg-panel px-4 py-2.5 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value="" disabled>
              Select a language
            </option>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.englishName}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create menu"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
