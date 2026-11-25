import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { MobileMenu } from "@/components/landing/MobileMenu";
import { LandingDict, SiteLocale, localeHref, signupHref } from "@/lib/landing-content";
import { LANDING_CONFIG } from "@/lib/landing/config";

export type NavLink = { href: string; label: string };

export function navLinks(dict: LandingDict["nav"]): NavLink[] {
  return [
    ...(LANDING_CONFIG.demoMenuPath ? [{ href: "#demo", label: dict.demo }] : []),
    { href: "#how-it-works", label: dict.how },
    { href: "#pricing", label: dict.pricing },
    { href: "#faq", label: dict.faq },
  ];
}

export function Navbar({ dict, cta, locale }: { dict: LandingDict["nav"]; cta: string; locale: SiteLocale }) {
  const links = navLinks(dict);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href={localeHref(locale)} className="shrink-0">
          <Logo className="h-7 sm:h-8" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink-soft lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-amber">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher current={locale} />
          </div>
          <Link href="/login" className="hidden text-sm text-ink-soft hover:text-amber md:block">
            {dict.login}
          </Link>
          {/* Always visible, mobile included (the header is sticky). */}
          <LinkButton href={signupHref(locale)} variant="amber" className="px-3.5 py-2 text-xs sm:px-5 sm:text-sm">
            {cta}
          </LinkButton>
          <MobileMenu links={links} login={dict.login} locale={locale} />
        </div>
      </div>
    </header>
  );
}
