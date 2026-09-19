import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <Link href="/">
          <Logo className="h-8" />
        </Link>
        <div className="mt-10">
          <h1 className="font-display text-2xl text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
