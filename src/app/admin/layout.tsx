import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { requireAdminUserId } from "@/lib/session";
import { Logo } from "@/components/ui/Logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Not found (not "forbidden") on purpose — a logged-in non-admin hitting
  // /admin shouldn't learn the route even exists.
  const adminUserId = await requireAdminUserId();
  if (!adminUserId) notFound();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-navy">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo variant="negative" className="h-6" />
            <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-medium text-amber">
              Admin
            </span>
          </div>
          <Link href="/dashboard" className="text-sm text-paper/70 hover:text-paper">
            Back to dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
