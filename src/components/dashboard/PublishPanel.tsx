"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check, Copy, Download, RefreshCw, Printer, Lock, Languages } from "lucide-react";
import type { DashboardDict } from "@/lib/dashboard-content";
import { drawQrCard, canvasToPngBlob } from "@/lib/qr-card";
import { TranslationProgress } from "@/components/dashboard/TranslationProgress";

export function PublishPanel({
  menuId,
  isPublished,
  canPublish,
  publicUrl,
  qrDataUrl,
  restaurantName,
  defaultLanguage,
  dict,
  languageOptions,
}: {
  menuId: string;
  isPublished: boolean;
  canPublish: boolean;
  publicUrl: string;
  qrDataUrl: string | null;
  restaurantName: string;
  defaultLanguage: string;
  dict: DashboardDict["publish"];
  languageOptions: { code: string; label: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsSubscription, setNeedsSubscription] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [pdfLang, setPdfLang] = useState(defaultLanguage);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translationsRemaining, setTranslationsRemaining] = useState<number | null>(null);
  const [translationTotal, setTranslationTotal] = useState<number | null>(null);
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);
  const [cardReady, setCardReady] = useState(false);

  useEffect(() => {
    if (!qrDataUrl || !cardCanvasRef.current) return;
    setCardReady(false);
    drawQrCard(cardCanvasRef.current, { restaurantName, qrDataUrl, defaultLanguage })
      .then(() => setCardReady(true))
      .catch(() => setCardReady(false));
  }, [qrDataUrl, restaurantName, defaultLanguage]);

  async function downloadCard() {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const blob = await canvasToPngBlob(canvas);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${restaurantName.toLowerCase().replace(/\s+/g, "-")}-menuo-table-card.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Publishing itself is instant. Translating into 20 languages is separate
  // work, done in small bounded batches (see /api/publish/translate) so a
  // single request never has to carry a whole menu's worth of translation
  // calls — that's what used to make big menus time out or look stuck.
  async function runTranslationBatches(initialTotal?: number) {
    setTranslating(true);
    setTranslationTotal(initialTotal ?? null);
    let consecutiveFailures = 0;
    try {
      while (true) {
        const res = await fetch("/api/publish/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menuId }),
        });
        if (!res.ok) {
          consecutiveFailures++;
          if (consecutiveFailures >= 3) {
            setError(dict.translateSnag);
            break;
          }
          continue;
        }
        consecutiveFailures = 0;
        const data = await res.json();
        setTranslationsRemaining(data.remaining);
        // First response of a run started without a known total (e.g.
        // clicking "Update translations" directly) — back into the total
        // from what's left plus what this batch just attempted.
        setTranslationTotal((prev) => prev ?? data.remaining + data.translatedInBatch);
        if (data.done) break;
      }
    } finally {
      setTranslating(false);
      setTranslationsRemaining(null);
      setTranslationTotal(null);
      router.refresh();
    }
  }

  async function togglePublish(publish: boolean) {
    setLoading(true);
    setError(null);
    setNeedsSubscription(false);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId, publish }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "SUBSCRIPTION_REQUIRED") setNeedsSubscription(true);
        // API errors are English-only; the subscription case has its own
        // localized notice above the button.
        setError(dict.genericError);
        return;
      }
      if (publish && isPublished) {
        setRefreshed(true);
        setTimeout(() => setRefreshed(false), 3000);
      }
      router.refresh();
      if (publish && data.pendingTranslations > 0) {
        setTranslationsRemaining(data.pendingTranslations);
        runTranslationBatches(data.pendingTranslations);
      }
    } catch {
      setError(dict.genericError);
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function downloadPdf() {
    setDownloadingPdf(true);
    setPdfError(null);
    try {
      const res = await fetch(`/api/menu-pdf?menuId=${menuId}&lang=${pdfLang}`);
      if (!res.ok) throw new Error("PDF request failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${restaurantName.toLowerCase().replace(/\s+/g, "-")}-menu-${pdfLang}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setPdfError(dict.pdfError);
    } finally {
      setDownloadingPdf(false);
    }
  }

  return (
    <div className="max-w-xl">
      {!isPublished ? (
        <div className="rounded-xl border border-border bg-panel p-6">
          {!canPublish && (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-amber/10 p-4 text-sm text-navy">
              <Lock size={16} className="mt-0.5 shrink-0" />
              <div>
                {dict.paidPlan}{" "}
                <Link href="/dashboard/billing" className="font-medium text-amber hover:underline">
                  {dict.subscribe}
                </Link>
                .
              </div>
            </div>
          )}
          <p className="text-sm text-ink-soft">
            {dict.draftNote}
          </p>
          {error && !needsSubscription && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <Button
            variant="amber"
            className="mt-5"
            onClick={() => togglePublish(true)}
            disabled={loading}
          >
            {loading ? dict.publishing : dict.publishCta}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 rounded-full bg-green/10 px-4 py-2 text-sm text-green w-fit">
            <Check size={16} /> {dict.isLive}
          </div>

          {qrDataUrl && (
            <div className="flex flex-col items-center rounded-xl border border-border bg-panel p-8">
              <canvas
                ref={cardCanvasRef}
                className="w-64 rounded-lg shadow-md"
                aria-label={dict.cardAria.replace("{name}", restaurantName)}
              />
              <p className="mt-4 text-xs text-ink-soft">
                {dict.cardNote}
              </p>
              <button
                onClick={downloadCard}
                disabled={!cardReady}
                className="mt-3 inline-flex items-center gap-2 text-sm text-amber hover:underline disabled:opacity-50"
              >
                <Download size={16} /> {dict.downloadCard}
              </button>
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">{dict.publicLink}</p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 truncate rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink">
                {publicUrl}
              </code>
              <button
                onClick={copyLink}
                className="rounded-md border border-border p-2 text-ink-soft hover:border-amber hover:text-amber"
                aria-label={dict.copyLink}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              <Languages size={16} /> {dict.translationsTitle}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {dict.translationsHint}
            </p>
            <div className="mt-4">
              {translating && translationTotal && translationsRemaining !== null ? (
                <TranslationProgress
                  percent={Math.round(((translationTotal - translationsRemaining) / translationTotal) * 100)}
                  label={dict.progress}
                />
              ) : (
                <Button variant="outline" onClick={() => togglePublish(true)} disabled={loading || translating}>
                  <RefreshCw size={16} /> {loading ? dict.updating : dict.updateTranslations}
                </Button>
              )}
            </div>
            {refreshed && !translating && <p className="mt-2 text-sm text-green">{dict.translationsUpdated}</p>}
          </div>

          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              <Printer size={16} /> {dict.printTitle}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {dict.printHint}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select
                value={pdfLang}
                onChange={(e) => setPdfLang(e.target.value)}
                className="rounded-md border border-border bg-panel px-3 py-2 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              >
                {languageOptions.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" onClick={downloadPdf} disabled={downloadingPdf}>
                <Download size={16} /> {downloadingPdf ? dict.generating : dict.downloadPdf}
              </Button>
            </div>
            {pdfError && <p className="mt-2 text-sm text-red-600">{pdfError}</p>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button variant="outline" onClick={() => togglePublish(false)} disabled={loading || translating}>
            {loading ? dict.unpublishing : dict.unpublish}
          </Button>
        </div>
      )}
    </div>
  );
}
