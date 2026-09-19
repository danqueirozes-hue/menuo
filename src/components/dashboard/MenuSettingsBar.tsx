"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";

export function MenuSettingsBar({
  menuId,
  name,
  defaultLanguage,
}: {
  menuId: string;
  name: string;
  defaultLanguage: string;
}) {
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [lang, setLang] = useState(defaultLanguage);
  const [saved, setSaved] = useState(false);

  async function save(data: Record<string, string>) {
    await fetch(`/api/menus/${menuId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    router.refresh();
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      {editingName ? (
        <input
          autoFocus
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={() => {
            setEditingName(false);
            if (nameValue.trim() && nameValue !== name) save({ name: nameValue.trim() });
            else setNameValue(name);
          }}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className="font-display border-b border-amber bg-transparent text-3xl text-ink focus:outline-none"
        />
      ) : (
        <button
          onClick={() => setEditingName(true)}
          className="font-display flex items-center gap-2 text-3xl text-ink hover:text-amber"
        >
          {name} <Pencil size={16} className="text-ink-soft" />
        </button>
      )}

      <div className="ml-auto flex items-center gap-2 text-sm">
        <span className="text-ink-soft">Source language:</span>
        <select
          value={lang}
          onChange={(e) => {
            setLang(e.target.value);
            save({ defaultLanguage: e.target.value });
          }}
          className="rounded-md border border-border bg-panel px-2 py-1.5 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.englishName}
            </option>
          ))}
        </select>
        {saved && <Check size={16} className="text-green" />}
      </div>
    </div>
  );
}
