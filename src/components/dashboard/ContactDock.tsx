import { Mail, HelpCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

// Floating contact + help cluster shown across the whole dashboard — the
// only way to reach MENUO's own team from inside the app, since the
// dashboard has no marketing chrome of its own.
export function ContactDock() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      <a
        href="mailto:contato@menuoglobal.com"
        aria-label="Email MENUO"
        title="Email us"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel text-ink-soft shadow-sm transition-colors hover:border-amber hover:text-amber"
      >
        <Mail size={16} />
      </a>
      <a
        href="https://www.instagram.com/menuoglobal/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="MENUO on Instagram"
        title="Instagram"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel text-ink-soft shadow-sm transition-colors hover:border-amber hover:text-amber"
      >
        <InstagramIcon size={16} />
      </a>
      <a
        href="mailto:contato@menuoglobal.com?subject=MENUO%20Support"
        aria-label="Help"
        className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-panel px-4 text-sm text-ink-soft shadow-sm transition-colors hover:border-amber hover:text-amber"
      >
        <HelpCircle size={16} /> Help
      </a>
    </div>
  );
}
