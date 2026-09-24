import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export function Footer() {
  return (
    <footer className="border-t border-border bg-paper py-10 text-sm text-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 sm:flex-row">
        <Logo className="h-6" />
        <p className="font-slogan order-last sm:order-none">
          © {new Date().getFullYear()} MENUO. One menu. Every language.
        </p>
        <div className="flex items-center gap-3">
          <a
            href="mailto:contato@menuoglobal.com"
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
    </footer>
  );
}
