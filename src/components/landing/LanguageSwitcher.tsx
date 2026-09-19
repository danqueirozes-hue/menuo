"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import { SITE_LOCALES, LOCALE_LABELS, localeHref, SiteLocale } from "@/lib/landing-content";

export function LanguageSwitcher({ current }: { current: SiteLocale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-ink-soft hover:border-amber hover:text-amber"
        aria-label="Change language"
      >
        <Globe size={14} />
        {LOCALE_LABELS[current]}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-panel shadow-lg">
          {SITE_LOCALES.map((locale) => (
            <Link
              key={locale}
              href={localeHref(locale)}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm hover:bg-paper hover:text-amber ${
                locale === current ? "font-medium text-amber" : "text-ink"
              }`}
            >
              {LOCALE_LABELS[locale]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
