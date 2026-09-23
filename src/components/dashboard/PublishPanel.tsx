"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check, Copy, Download, RefreshCw, Printer, Lock } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
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
}: {
  menuId: string;
  isPublished: boolean;
  canPublish: boolean;
  publicUrl: string;
  qrDataUrl: string | null;
  restaurantName: string;
  defaultLanguage: string;
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
    drawQrCard(cardCanvasRef.current, { restaurantName, qrDataUrl })
      .then(() => setCardReady(true))
      .catch(() => setCardReady(false));
  }, [qrDataUrl, restaurantName]);

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
            setError("Translating hit a snag. Click \"Update translations\" to pick up where it left off.");
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
        setError(data.error || "Something went wrong.");
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
      setError("Something went wrong. Please try again.");
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
      setPdfError("Could not generate the PDF. Please try again.");
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
                Publishing is part of a paid plan.{" "}
                <Link href="/dashboard/billing" className="font-medium text-amber hover:underline">
                  Subscribe to go live
                </Link>
                .
              </div>
            </div>
          )}
          <p className="text-sm text-ink-soft">
            Your menu is currently a draft — only visible to you. Publish it
            to generate your QR code and make it live for guests.
          </p>
          {error && !needsSubscription && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <Button
            className="mt-5 bg-amber text-navy hover:bg-amber-soft"
            onClick={() => togglePublish(true)}
            disabled={loading}
          >
            {loading ? "Publishing…" : "Publish menu"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 rounded-full bg-green/10 px-4 py-2 text-sm text-green w-fit">
            <Check size={16} /> Your menu is live
          </div>

          {qrDataUrl && (
            <div className="flex flex-col items-center rounded-xl border border-border bg-panel p-8">
              <canvas
                ref={cardCanvasRef}
                className="w-64 rounded-lg shadow-md"
                aria-label={`Table card with QR code for ${restaurantName}`}
              />
              <p className="mt-4 text-xs text-ink-soft">
                A print-ready table card — not just the raw QR code.
              </p>
              <button
                onClick={downloadCard}
                disabled={!cardReady}
                className="mt-3 inline-flex items-center gap-2 text-sm text-amber hover:underline disabled:opacity-50"
              >
                <Download size={16} /> Download table card
              </button>
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">Public menu link</p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 truncate rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink">
                {publicUrl}
              </code>
              <button
                onClick={copyLink}
                className="rounded-md border border-border p-2 text-ink-soft hover:border-amber hover:text-amber"
                aria-label="Copy link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              <Printer size={16} /> Print menu / PDF
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              Choose a language and download a print-ready PDF — handy for
              printing physical menus or emailing to guests.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select
                value={pdfLang}
                onChange={(e) => setPdfLang(e.target.value)}
                className="rounded-md border border-border bg-panel px-3 py-2 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.englishName}
                  </option>
                ))}
              </select>
              <Button variant="outline" onClick={downloadPdf} disabled={downloadingPdf}>
                <Download size={16} /> {downloadingPdf ? "Generating…" : "Download PDF"}
              </Button>
            </div>
            {pdfError && <p className="mt-2 text-sm text-red-600">{pdfError}</p>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {refreshed && !translating && <p className="text-sm text-green">Translations updated.</p>}
          {translating && translationTotal && translationsRemaining !== null && (
            <TranslationProgress
              percent={Math.round(((translationTotal - translationsRemaining) / translationTotal) * 100)}
            />
          )}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => togglePublish(true)}
              disabled={loading || translating}
            >
              <RefreshCw size={16} /> {translating ? "Translating…" : loading ? "Updating…" : "Update translations"}
            </Button>
            <Button variant="outline" onClick={() => togglePublish(false)} disabled={loading || translating}>
              {loading ? "Unpublishing…" : "Unpublish menu"}
            </Button>
          </div>
          <p className="text-xs text-ink-soft">
            Use &quot;Update translations&quot; after editing a dish, adding a
            translation provider, or changing your menu — it fills in
            whatever is missing without taking your menu offline.
          </p>
        </div>
      )}
    </div>
  );
}
