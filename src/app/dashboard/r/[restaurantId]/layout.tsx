import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import {
  getUserRestaurants,
  getSubscription,
  getEffectiveLimits,
  isSubscriptionActive,
} from "@/lib/session";
import { getPlan } from "@/lib/plans";
import { Logo } from "@/components/ui/Logo";
import { EstablishmentSwitcher } from "@/components/dashboard/EstablishmentSwitcher";

export default async function EstablishmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const restaurants = await getUserRestaurants(session.user.id);
  const current = restaurants.find((r) => r.id === restaurantId);
  if (!current) notFound();

  const subscription = await getSubscription(session.user.id);
  const limits = getEffectiveLimits(subscription);
  const plan = subscription ? getPlan(subscription.plan) : null;
  const active = isSubscriptionActive(subscription);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-border bg-panel px-6 py-8 sm:flex">
        {/* Deliberately not linking to "/" — clicking the logo from inside
            the dashboard should feel like going home, not like leaving the
            app. Only the explicit "Log out" below sends you to the
            marketing site. */}
        <Link href="/dashboard">
          <Logo className="h-7" />
        </Link>

        <div className="mt-6">
          <EstablishmentSwitcher
            current={{ id: current.id, name: current.name }}
            restaurants={restaurants.map((r) => ({ id: r.id, name: r.name }))}
            canAddMore={restaurants.length < limits.maxEstablishments}
          />
        </div>

        <nav className="mt-8 flex flex-col gap-1 text-sm">
          <Link
            href={`/dashboard/r/${current.id}`}
            className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
          >
            Menus
          </Link>
          <Link
            href={`/dashboard/r/${current.id}/publish`}
            className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
          >
            Publish & QR code
          </Link>
          <Link
            href={`/dashboard/r/${current.id}/settings`}
            className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
          >
            Establishment settings
          </Link>
          <Link
            href="/dashboard/billing"
            className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
          >
            Billing
          </Link>
        </nav>

        <div className="mt-auto">
          <Link
            href="/dashboard/billing"
            className={`block rounded-full px-3 py-1 text-xs w-fit ${
              active ? "bg-green/15 text-green" : "bg-amber-soft/40 text-ink-soft"
            }`}
          >
            {active ? `${plan?.name ?? "Active"} plan` : "No active plan"}
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="mt-4 block text-sm text-ink-soft hover:text-amber">Log out</button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-panel px-6 py-4 sm:hidden">
          <Link href="/dashboard">
            <Logo className="h-6" />
          </Link>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
