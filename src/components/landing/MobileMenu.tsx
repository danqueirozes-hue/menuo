"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LOCALE_LABELS, SITE_LOCALES, SITE_LOCALE_COOKIE, SiteLocale, localeHref } from "@/lib/landing-content";
import type { NavLink } from "@/components/landing/Navbar";

export function MobileMenu({ links, login, locale }: { links: NavLink[]; login: string; locale: SiteLocale }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft hover:border-amber hover:text-amber"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-border bg-paper px-6 py-6 shadow-lg">
          <nav className="flex flex-col gap-4 text-sm text-ink-soft">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={close} className="hover:text-amber">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="md:hidden">
            <hr className="my-5 border-border" />
            <Link href="/login" onClick={close} className="block text-sm font-medium text-ink hover:text-amber">
              {login}
            </Link>
            <div className="mt-5 flex flex-wrap gap-2">
              {SITE_LOCALES.map((l) => (
                <Link
                  key={l}
                  href={localeHref(l)}
                  onClick={() => {
                    document.cookie = `${SITE_LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
                    close();
                  }}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    l === locale ? "border-amber text-amber" : "border-border text-ink-soft"
                  }`}
                >
                  {LOCALE_LABELS[l]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
