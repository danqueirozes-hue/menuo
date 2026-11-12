"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { resizeImageForUpload } from "@/lib/resize-image";
import type { DashboardDict } from "@/lib/dashboard-content";
import type { AllergenKey } from "@/lib/allergens";
import type { ImportedMenu } from "@/lib/menu-import";

const MAX_FILES = 4;
const MAX_BYTES = 5 * 1024 * 1024;
const POLL_MS = 3000;

type Phase = "pick" | "reading" | "review" | "applying";

export function MenuImporter({
  dict: t,
  menuId,
  builderHref,
  available,
  remaining,
  currency,
  allergenNames,
}: {
  dict: DashboardDict["menuImport"];
  menuId: string;
  builderHref: string;
  available: boolean;
  /** null = unlimited (admin). */
  remaining: number | null;
  currency: string;
  allergenNames: Record<AllergenKey, string>;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<Phase>("pick");
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ImportedMenu | null>(null);
  const [keep, setKeep] = useState<Set<number>>(new Set());
  const [left, setLeft] = useState(remaining);
  const inputRef = useRef<HTMLInputElement>(null);

  const money = new Intl.NumberFormat(undefined, { style: "currency", currency });

  // Poll the background job until it finishes.
  useEffect(() => {
    if (phase !== "reading" || !jobId) return;
    const timer = setInterval(async () => {
      const res = await fetch(`/api/menu-import/${jobId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "pending") return;
      clearInterval(timer);
      if (data.status === "done" && data.result?.sections?.length) {
        setDraft(data.result);
        setKeep(new Set(data.result.sections.map((_: unknown, i: number) => i)));
        setPhase("review");
      } else {
        setError(data.status === "done" ? t.empty : data.error === "too_long" ? t.tooLong : t.failed);
        setPhase("pick");
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [phase, jobId, t]);

  function choose(list: FileList | null) {
    setError(null);
    const picked = Array.from(list ?? []);
    const pdf = picked.find((f) => f.type === "application/pdf");
    setFiles(pdf ? [pdf] : picked.filter((f) => f.type.startsWith("image/")).slice(0, MAX_FILES));
  }

  async function start() {
    setError(null);
    const prepared = await Promise.all(files.map((f) => (f.type.startsWith("image/") ? resizeImageForUpload(f) : f)));
    if (prepared.reduce((n, f) => n + f.size, 0) > MAX_BYTES) return setError(t.tooLarge);

    const body = new FormData();
    body.append("menuId", menuId);
    prepared.forEach((f) => body.append("files", f));
    setPhase("reading");
    const res = await fetch("/api/menu-import", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setPhase("pick");
      return setError(
        data.error === "limit" ? t.limitReached : data.error === "too_large" ? t.tooLarge : data.error === "unavailable" ? t.unavailable : t.failed
      );
    }
    setLeft((n) => (n === null ? null : Math.max(0, n - 1)));
    setJobId(data.jobId);
  }

  async function apply() {
    if (!jobId) return;
    setPhase("applying");
    const res = await fetch(`/api/menu-import/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: [...keep] }),
    });
    if (!res.ok) {
      setPhase("review");
      return setError(t.failed);
    }
    router.push(builderHref);
    router.refresh();
  }

  if (!available) return <p className="rounded-xl border border-border bg-panel p-6 text-sm text-ink-soft">{t.unavailable}</p>;

  if (phase === "review" || phase === "applying") {
    const sections = draft?.sections ?? [];
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-xl text-ink">{t.reviewTitle}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t.reviewHint}</p>
        </div>
        {sections.map((section, i) => (
          <div key={i} className={`rounded-xl border bg-panel p-5 ${keep.has(i) ? "border-amber" : "border-border opacity-60"}`}>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={keep.has(i)}
                onChange={() =>
                  setKeep((prev) => {
                    const next = new Set(prev);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  })
                }
                className="h-4 w-4 accent-amber"
              />
              <span className="font-display text-lg text-ink">{section.name}</span>
              <span className="text-xs text-ink-soft">{t.dishesCount.replace("{count}", String(section.items.length))}</span>
            </label>
            <ul className="mt-3 divide-y divide-border">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start justify-between gap-4 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="text-ink">{item.name}</p>
                    {item.description && <p className="text-xs text-ink-soft">{item.description}</p>}
                    {item.allergens.length > 0 && (
                      <p className="mt-0.5 text-xs text-amber">
                        {t.allergensToConfirm}: {item.allergens.map((a) => allergenNames[a]).join(", ")}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-right text-ink">
                    {item.variants.length >= 2
                      ? item.variants.map((v) => `${v.label} ${money.format(v.price)}`).join(" · ")
                      : item.price > 0
                        ? money.format(item.price)
                        : <span className="text-xs text-ink-soft">{t.noPrice}</span>}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <Button variant="amber" onClick={apply} disabled={phase === "applying" || keep.size === 0}>
            {phase === "applying" ? t.applying : t.apply}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDraft(null);
              setFiles([]);
              setPhase("pick");
            }}
            disabled={phase === "applying"}
          >
            {t.retry}
          </Button>
        </div>
      </div>
    );
  }

  const noneLeft = left !== null && left <= 0;
  return (
    <div className="max-w-xl rounded-2xl border border-border bg-panel p-6">
      {phase === "reading" ? (
        <p className="flex items-center gap-3 text-sm text-ink">
          <Loader2 size={18} className="animate-spin text-amber" /> {t.reading}
        </p>
      ) : noneLeft ? (
        <p className="text-sm text-ink-soft">{t.limitReached}</p>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => choose(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-8 text-ink-soft hover:border-amber hover:text-amber"
          >
            <FileUp size={28} />
            <span className="text-sm font-medium">{t.pick}</span>
            <span className="text-xs">{t.hint}</span>
          </button>
          {files.length > 0 && (
            <p className="mt-3 text-sm text-ink">{t.selected.replace("{count}", String(files.length))}</p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button variant="amber" onClick={start} disabled={files.length === 0}>
              {t.start}
            </Button>
            {left !== null && <span className="text-xs text-ink-soft">{t.remaining.replace("{count}", String(left))}</span>}
          </div>
        </>
      )}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
