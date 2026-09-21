import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { MobileMenu } from "@/components/landing/MobileMenu";
import { LandingDict, SiteLocale, localeHref } from "@/lib/landing-content";

export function Navbar({ dict, locale }: { dict: LandingDict["nav"]; locale: SiteLocale }) {
  const base = localeHref(locale);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-paper/90 backdrop-blur relative">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href={base}>
          <Logo className="h-8" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          <a href="#benefits" className="hover:text-amber">{dict.benefits}</a>
          <a href="#how-it-works" className="hover:text-amber">{dict.howItWorks}</a>
          <a href="#languages" className="hover:text-amber">{dict.languages}</a>
          <a href="#pricing" className="hover:text-amber">{dict.pricing}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} />
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm text-ink-soft hover:text-amber">
              {dict.login}
            </Link>
            <LinkButton href="/signup" className="text-sm">
              {dict.cta}
            </LinkButton>
          </div>
          <MobileMenu dict={dict} />
        </div>
      </div>
    </header>
  );
}
