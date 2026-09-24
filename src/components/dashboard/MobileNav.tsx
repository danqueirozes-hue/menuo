"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-panel px-6 py-4 sm:hidden">
        <Link href="/dashboard">
          <Logo className="h-6" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-ink-soft hover:text-amber"
        >
          <Menu size={24} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} />
          <div
            // Closing on any click inside is deliberate — the drawer is
            // almost entirely nav links, so tapping one should both
            // navigate and dismiss it without a separate close step.
            onClick={() => setOpen(false)}
            className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto bg-panel px-6 py-8 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <Logo className="h-7" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-ink-soft hover:text-amber"
              >
                <X size={22} />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
