import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-paper py-10 text-sm text-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <Logo className="h-6" />
        <p className="font-slogan">© {new Date().getFullYear()} MENUO. One menu. Every language.</p>
      </div>
    </footer>
  );
}
