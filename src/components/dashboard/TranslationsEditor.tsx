"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { DashboardDict } from "@/lib/dashboard-content";

type ItemRow = { id: string; name: string; description: string; tName: string; tDescription: string };
type SectionRow = { id: string; name: string; translated: string; items: ItemRow[] };

const input =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-amber focus:outline-none";

export function TranslationsEditor({
  menuId,
  lang,
  languages,
  keepOriginalNames,
  sections: initial,
  dict,
}: {
  menuId: string;
  lang: string;
  languages: { code: string; label: string }[];
  keepOriginalNames: boolean;
  sections: SectionRow[];
  dict: DashboardDict["translations"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sections, setSections] = useState(initial);
  const [keepNames, setKeepNames] = useState(keepOriginalNames);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const hasTranslations = initial.some((s) => s.translated || s.items.some((i) => i.tName));

  function editSection(id: string, translated: string) {
    setStatus("idle");
    setSections((all) => all.map((s) => (s.id === id ? { ...s, translated } : s)));
  }
  function editItem(id: string, patch: Partial<ItemRow>) {
    setStatus("idle");
    setSections((all) => all.map((s) => ({ ...s, items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })));
  }

  async function toggleKeepNames(value: boolean) {
    setKeepNames(value);
    const res = await fetch(`/api/menus/${menuId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keepOriginalNames: value }),
    });
    if (!res.ok) setKeepNames(!value);
  }

  async function save() {
    setStatus("saving");
    const res = await fetch(`/api/menus/${menuId}/translations`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        sections: sections.map((s) => ({ id: s.id, name: s.translated })),
        items: sections.flatMap((s) => s.items.map((i) => ({ id: i.id, name: i.tName, description: i.tDescription }))),
      }),
    });
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-8">
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-panel p-4">
        <input
          type="checkbox"
          checked={keepNames}
          onChange={(e) => toggleKeepNames(e.target.checked)}
          className="mt-1 h-4 w-4 accent-amber"
        />
        <span>
          <span className="block text-sm font-medium text-ink">{dict.keepNames}</span>
          <span className="mt-0.5 block text-xs text-ink-soft">{dict.keepNamesHint}</span>
        </span>
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor="tr-lang" className="text-sm font-medium text-ink">
          {dict.language}
        </label>
        <select
          id="tr-lang"
          value={lang}
          onChange={(e) => router.push(`${pathname}?lang=${e.target.value}`)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {!hasTranslations ? (
        <p className="mt-8 rounded-xl border border-dashed border-border p-6 text-sm text-ink-soft">{dict.empty}</p>
      ) : (
        <>
          <p className="mt-4 text-xs text-ink-soft">{dict.resetHint}</p>
          <div className="mt-6 space-y-8">
            {sections.map((s) => (
              <section key={s.id} className="rounded-2xl border border-border bg-paper p-5">
                <p className="text-xs uppercase tracking-wide text-ink-soft">
                  {dict.original}: <span className="normal-case text-ink">{s.name}</span>
                </p>
                <input
                  value={s.translated}
                  onChange={(e) => editSection(s.id, e.target.value)}
                  aria-label={`${dict.sections}: ${s.name}`}
                  className={`${input} mt-2 font-display text-lg`}
                />
                <div className="mt-5 space-y-5">
                  {s.items.map((i) => (
                    <div key={i.id} className="border-t border-border pt-4">
                      <p className="font-medium text-ink">{i.name}</p>
                      {i.description && <p className="mt-0.5 text-xs text-ink-soft">{i.description}</p>}
                      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_2fr]">
                        <label className="block">
                          <span className="text-xs text-ink-soft">{dict.name}</span>
                          <input
                            value={i.tName}
                            onChange={(e) => editItem(i.id, { tName: e.target.value })}
                            className={`${input} mt-1`}
                          />
                          {keepNames && <span className="mt-1 block text-[11px] text-ink-soft">{dict.nameHint}</span>}
                        </label>
                        <label className="block">
                          <span className="text-xs text-ink-soft">{dict.description}</span>
                          <textarea
                            value={i.tDescription}
                            onChange={(e) => editItem(i.id, { tDescription: e.target.value })}
                            rows={2}
                            className={`${input} mt-1`}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="sticky bottom-4 mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-panel/95 p-4 backdrop-blur">
            <button
              onClick={save}
              disabled={status === "saving"}
              className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-paper hover:bg-navy-soft disabled:opacity-50"
            >
              {status === "saving" ? dict.saving : dict.save}
            </button>
            {status === "saved" && <span className="text-sm text-green">{dict.saved}</span>}
            {status === "error" && <span className="text-sm text-red-600">{dict.error}</span>}
          </div>
        </>
      )}
    </div>
  );
}
