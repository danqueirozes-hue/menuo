import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { CookiePreferencesLink } from "@/components/landing/CookiePreferencesLink";
import { LOCALE_LABELS, SITE_LOCALES, SiteLocale, localeHref } from "@/lib/landing-content";
import { LANDING_CONFIG } from "@/lib/landing/config";

export function Footer({ tagline, cookies, locale }: { tagline: string; cookies: string; locale: SiteLocale }) {
  return (
    <footer className="border-t border-border bg-paper py-10 text-sm text-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 sm:flex-row">
        <Logo className="h-6" />
        <p className="font-slogan order-last sm:order-none">
          © {new Date().getFullYear()} MENUO. {tagline}
        </p>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${LANDING_CONFIG.contactEmail}`}
            aria-label="Email MENUO"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-amber hover:text-amber"
          >
            <Mail size={16} />
          </a>
          <a
            href="https://www.instagram.com/menuoglobal/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MENUO on Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-amber hover:text-amber"
          >
            <InstagramIcon size={16} />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 text-xs">
        {SITE_LOCALES.map((l) => (
          <Link key={l} href={localeHref(l)} className={l === locale ? "text-amber" : "hover:text-amber"}>
            {LOCALE_LABELS[l]}
          </Link>
        ))}
        <span aria-hidden>·</span>
        <CookiePreferencesLink label={cookies} />
      </div>
    </footer>
  );
}
