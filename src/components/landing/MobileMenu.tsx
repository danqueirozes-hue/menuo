"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { LandingDict } from "@/lib/landing-content";

export function MobileMenu({ dict }: { dict: LandingDict["nav"] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
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
            <a href="#benefits" onClick={close} className="hover:text-amber">
              {dict.benefits}
            </a>
            <a href="#how-it-works" onClick={close} className="hover:text-amber">
              {dict.howItWorks}
            </a>
            <a href="#languages" onClick={close} className="hover:text-amber">
              {dict.languages}
            </a>
            <a href="#pricing" onClick={close} className="hover:text-amber">
              {dict.pricing}
            </a>
          </nav>
          <hr className="my-5 border-border" />
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              onClick={close}
              className="text-center text-sm font-medium text-ink hover:text-amber"
            >
              {dict.login}
            </Link>
            <LinkButton href="/signup" className="w-full text-sm">
              {dict.cta}
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
