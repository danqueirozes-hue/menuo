import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getUserRestaurants,
  getSubscription,
  getEffectiveLimits,
  isSubscriptionActive,
} from "@/lib/session";
import { getPlan } from "@/lib/plans";
import { Logo } from "@/components/ui/Logo";
import { EstablishmentSwitcher } from "@/components/dashboard/EstablishmentSwitcher";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { DashboardDict, getDashboardContent } from "@/lib/dashboard-content";
import { prisma } from "@/lib/prisma";
import { mustChoosePlan } from "@/lib/billing-gate";

function SidebarNav({
  current,
  restaurants,
  canAddMore,
  active,
  planName,
  dict,
  accountLabel,
}: {
  current: { id: string; name: string };
  restaurants: { id: string; name: string }[];
  canAddMore: boolean;
  active: boolean;
  planName: string | null;
  dict: DashboardDict["nav"];
  accountLabel: string;
}) {
  return (
    <>
      <div className="mt-6">
        <EstablishmentSwitcher current={current} restaurants={restaurants} canAddMore={canAddMore} dict={dict} />
      </div>

      <nav className="mt-8 flex flex-col gap-1 text-sm">
        {/* prefetch={false} on every persistent sidebar link: Next.js
            prefetches visible links continuously, and each prefetch is an
            authenticated request through the auth middleware, which
            unconditionally re-issues the session cookie on every pass. A
            prefetch that resolves right after "Log out" clears the cookie
            can re-instate the old session, so these links must not keep
            firing prefetches while the sidebar just sits there. */}
        <Link
          href={`/dashboard/r/${current.id}`}
          prefetch={false}
          className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
        >
          {dict.menus}
        </Link>
        <Link
          href={`/dashboard/r/${current.id}/publish`}
          prefetch={false}
          className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
        >
          {dict.publish}
        </Link>
        <Link
          href={`/dashboard/r/${current.id}/settings`}
          prefetch={false}
          className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
        >
          {dict.settings}
        </Link>
        <Link
          href="/dashboard/billing"
          prefetch={false}
          className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
        >
          {dict.billing}
        </Link>
        <Link
          href="/dashboard/account"
          prefetch={false}
          className="rounded-md px-3 py-2 text-ink hover:bg-paper hover:text-amber"
        >
          {accountLabel}
        </Link>
      </nav>

      <div className="mt-auto">
        <Link
          href="/dashboard/account"
          prefetch={false}
          className={`block rounded-full px-3 py-1 text-xs w-fit ${
            active ? "bg-green/15 text-green" : "bg-amber-soft/40 text-ink-soft"
          }`}
        >
          {active ? (planName ? dict.activePlan.replace("{plan}", planName) : dict.activeFallback) : dict.noPlan}
        </Link>
        <form action="/api/logout" method="POST">
          <button className="mt-4 block text-sm text-ink-soft hover:text-amber">{dict.logout}</button>
        </form>
      </div>
    </>
  );
}

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

  const [subscription, user] = await Promise.all([
    getSubscription(session.user.id),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { createdAt: true, isAdmin: true } }),
  ]);
  // New accounts choose a plan + card (free trial) before using the dashboard.
  if (user && mustChoosePlan(user, subscription)) redirect("/dashboard/billing?welcome=1");
  const limits = getEffectiveLimits(subscription);
  const plan = subscription ? getPlan(subscription.plan) : null;
  const active = isSubscriptionActive(subscription);
  const content = getDashboardContent(current.menus[0]?.defaultLanguage);
  const dict = content.nav;

  const sidebarProps = {
    current: { id: current.id, name: current.name },
    restaurants: restaurants.map((r) => ({ id: r.id, name: r.name })),
    canAddMore: restaurants.length < limits.maxEstablishments,
    active,
    planName: plan?.name ?? null,
    dict,
    accountLabel: content.account.navLabel,
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-border bg-panel px-6 py-8 sm:flex">
        {/* Deliberately not linking to "/" — clicking the logo from inside
            the dashboard should feel like going home, not like leaving the
            app. Only the explicit "Log out" below sends you to the
            marketing site. */}
        <Link href="/dashboard" prefetch={false}>
          <Logo className="h-7" />
        </Link>
        <SidebarNav {...sidebarProps} />
      </aside>

      <div className="flex-1">
        <MobileNav openLabel={dict.openMenu} closeLabel={dict.closeMenu}>
          <SidebarNav {...sidebarProps} />
        </MobileNav>
        <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
