import { prisma } from "@/lib/prisma";
import { getPlan, priceCentsFor, PLAN_ORDER, PLANS, BillingInterval } from "@/lib/plans";
import { formatPrice } from "@/lib/currency";
import { AdminAccountsTable, AdminAccountRow } from "@/components/admin/AdminAccountsTable";
import { SignupsBarChart } from "@/components/admin/SignupsBarChart";
import { PlanBarChart } from "@/components/admin/PlanBarChart";

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getUTCDay();
  const diff = (day + 6) % 7; // days since Monday, Monday itself = 0
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/** Buckets signups into the last `weeksCount` Monday-aligned weeks, oldest first. */
function buildWeeklySignups(users: { createdAt: Date }[], weeksCount = 12) {
  const currentWeekStart = startOfWeek(new Date());
  const buckets = Array.from({ length: weeksCount }, (_, i) => {
    const start = new Date(currentWeekStart);
    start.setUTCDate(start.getUTCDate() - (weeksCount - 1 - i) * 7);
    return {
      startTime: start.getTime(),
      label: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: 0,
    };
  });
  for (const user of users) {
    const weekStart = startOfWeek(user.createdAt).getTime();
    const bucket = buckets.find((b) => b.startTime === weekStart);
    if (bucket) bucket.count++;
  }
  return buckets.map(({ label, count }) => ({ label, count }));
}

export default async function AdminPage() {
  const [users, totalRestaurants, totalMenus, publishedMenus] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        subscription: true,
        restaurants: { select: { id: true, name: true } },
      },
    }),
    prisma.restaurant.count(),
    prisma.menu.count(),
    prisma.menu.count({ where: { isPublished: true } }),
  ]);

  const weeklySignups = buildWeeklySignups(users.map((u) => ({ createdAt: u.createdAt })));
  const publishRate = totalMenus > 0 ? Math.round((publishedMenus / totalMenus) * 100) : 0;

  const totalAccounts = users.length;
  let activeCount = 0;
  let mrrCents = 0;
  const byPlan: Record<string, number> = {};

  for (const user of users) {
    const sub = user.subscription;
    const isActive = sub?.status === "active" || sub?.status === "trialing";
    if (!isActive || !sub) continue;
    activeCount++;
    byPlan[sub.plan] = (byPlan[sub.plan] ?? 0) + 1;

    const plan = getPlan(sub.plan);
    if (!plan) continue;
    const interval = (sub.interval as BillingInterval) ?? "monthly";
    const cents = priceCentsFor(plan, interval);
    mrrCents += interval === "annual" ? Math.round(cents / 12) : cents;
  }

  const rows: AdminAccountRow[] = users.map((user) => {
    const sub = user.subscription;
    const plan = sub ? getPlan(sub.plan) : null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      restaurants: user.restaurants.map((r) => r.name),
      planKey: sub?.plan ?? null,
      planName: plan?.name ?? null,
      interval: (sub?.interval as BillingInterval) ?? null,
      status: sub?.status ?? null,
    };
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Admin</h1>
      <p className="mt-2 text-ink-soft">
        Accounts created and estimated recurring revenue.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-panel p-5">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Total accounts</p>
          <p className="font-display mt-1 text-3xl text-ink">{totalAccounts}</p>
        </div>
        <div className="rounded-xl border border-border bg-panel p-5">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Active subscriptions</p>
          <p className="font-display mt-1 text-3xl text-ink">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-amber bg-amber/5 p-5">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Estimated MRR</p>
          <p className="font-display mt-1 text-3xl text-amber">{formatPrice(mrrCents, "EUR")}</p>
          <p className="mt-1 text-xs text-ink-soft">
            ≈ {formatPrice(mrrCents * 12, "EUR")}/yr · based on subscription records, not actual Stripe payments
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-ink">Growth</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-sm font-medium text-ink">New accounts per week</p>
            <p className="text-xs text-ink-soft">Last 12 weeks, by signup date.</p>
            <div className="mt-4">
              <SignupsBarChart data={weeklySignups} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-sm font-medium text-ink">Active subscriptions by plan</p>
            <p className="text-xs text-ink-soft">Accounts currently active or trialing.</p>
            <div className="mt-4">
              <PlanBarChart data={PLAN_ORDER.map((key) => ({ label: PLANS[key].name, count: byPlan[key] ?? 0 }))} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-xs uppercase tracking-wide text-ink-soft">Establishments</p>
            <p className="font-display mt-1 text-3xl text-ink">{totalRestaurants}</p>
          </div>
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-xs uppercase tracking-wide text-ink-soft">Menus created</p>
            <p className="font-display mt-1 text-3xl text-ink">{totalMenus}</p>
          </div>
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-xs uppercase tracking-wide text-ink-soft">Menus published</p>
            <p className="font-display mt-1 text-3xl text-ink">
              {publishedMenus} <span className="text-base text-ink-soft">/ {totalMenus}</span>
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber/15">
              <div className="h-full rounded-full bg-amber" style={{ width: `${publishRate}%` }} />
            </div>
            <p className="mt-1 text-xs text-ink-soft">{publishRate}% of menus are live</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-ink">All accounts</h2>
        <div className="mt-4">
          <AdminAccountsTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
