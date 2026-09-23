import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

// lucide-react dropped brand/logo icons — a small hand-drawn glyph avoids
// pulling in a whole icon package for one social link.
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

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
