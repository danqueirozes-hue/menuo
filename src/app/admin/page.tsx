import { LCPThresholds, CLSThresholds, INPThresholds } from "web-vitals";
import { prisma } from "@/lib/prisma";
import { getPlan, priceCentsFor, PLAN_ORDER, PLANS, BillingInterval } from "@/lib/plans";
import { formatPrice } from "@/lib/currency";
import { AdminAccountsTable, AdminAccountRow } from "@/components/admin/AdminAccountsTable";
import { SignupsBarChart } from "@/components/admin/SignupsBarChart";
import { HorizontalBarChart } from "@/components/admin/HorizontalBarChart";

const SITE_EVENTS_WINDOW_DAYS = 30;

function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

type VitalStatus = "good" | "needs-improvement" | "poor";

const VITAL_META: Record<
  string,
  { label: string; thresholds: readonly [number, number]; format: (v: number) => string }
> = {
  LCP: { label: "Largest Contentful Paint", thresholds: LCPThresholds, format: (v) => `${(v / 1000).toFixed(2)}s` },
  CLS: { label: "Cumulative Layout Shift", thresholds: CLSThresholds, format: (v) => v.toFixed(2) },
  INP: { label: "Interaction to Next Paint", thresholds: INPThresholds, format: (v) => `${Math.round(v)}ms` },
};

const STATUS_STYLES: Record<VitalStatus, string> = {
  good: "bg-green/15 text-green",
  "needs-improvement": "bg-amber/15 text-amber",
  poor: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<VitalStatus, string> = {
  good: "Good",
  "needs-improvement": "Needs improvement",
  poor: "Poor",
};

function classify(value: number, thresholds: readonly [number, number]): VitalStatus {
  if (value <= thresholds[0]) return "good";
  if (value <= thresholds[1]) return "needs-improvement";
  return "poor";
}

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
  const since = new Date(Date.now() - SITE_EVENTS_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [
    users,
    totalRestaurants,
    totalMenus,
    publishedMenus,
    topPages,
    topClicks,
    topCountries,
    topReferrers,
    vitalsRaw,
  ] = await Promise.all([
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
    prisma.siteEvent.groupBy({
      by: ["path"],
      where: { type: "pageview", createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    prisma.siteEvent.groupBy({
      by: ["href", "linkLabel"],
      where: { type: "click", createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { href: "desc" } },
      take: 8,
    }),
    prisma.siteEvent.groupBy({
      by: ["countryCode", "countryName"],
      where: { type: "pageview", createdAt: { gte: since }, countryCode: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { countryCode: "desc" } },
      take: 8,
    }),
    prisma.siteEvent.groupBy({
      by: ["referrerHost"],
      where: { type: "pageview", createdAt: { gte: since }, referrerHost: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { referrerHost: "desc" } },
      take: 8,
    }),
    prisma.siteEvent.findMany({
      where: { type: "vitals", createdAt: { gte: since } },
      select: { metricName: true, metricValue: true },
    }),
  ]);

  const vitalsByMetric: Record<string, number[]> = {};
  for (const v of vitalsRaw) {
    if (!v.metricName || v.metricValue == null) continue;
    (vitalsByMetric[v.metricName] ??= []).push(v.metricValue);
  }
  const vitalsSummary = Object.entries(VITAL_META).map(([name, meta]) => {
    const values = vitalsByMetric[name] ?? [];
    const p75 = percentile(values, 75);
    return {
      name,
      label: meta.label,
      sampleSize: values.length,
      p75Formatted: p75 !== null ? meta.format(p75) : null,
      status: p75 !== null ? classify(p75, meta.thresholds) : null,
    };
  });

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
              <HorizontalBarChart
                ariaLabel="Active subscriptions by plan"
                data={PLAN_ORDER.map((key) => ({ label: PLANS[key].name, count: byPlan[key] ?? 0 }))}
              />
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
        <h2 className="font-display text-xl text-ink">Site performance</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Anonymous traffic on the public site — no cookies, no visitor ID, no IP stored. Last{" "}
          {SITE_EVENTS_WINDOW_DAYS} days.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {vitalsSummary.map((v) => (
            <div key={v.name} className="rounded-xl border border-border bg-panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-ink-soft">{v.name}</p>
                {v.status && (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[v.status]}`}>
                    {STATUS_LABELS[v.status]}
                  </span>
                )}
              </div>
              <p className="font-display mt-1 text-3xl text-ink">{v.p75Formatted ?? "—"}</p>
              <p className="mt-1 text-xs text-ink-soft">
                {v.label} · p75{v.sampleSize > 0 ? ` of ${v.sampleSize} loads` : ""}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-sm font-medium text-ink">Most visited pages</p>
            <div className="mt-4">
              <HorizontalBarChart
                ariaLabel="Most visited pages"
                data={topPages.map((p) => ({ label: p.path, count: p._count._all }))}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-sm font-medium text-ink">Most clicked links</p>
            <div className="mt-4">
              <HorizontalBarChart
                ariaLabel="Most clicked links"
                data={topClicks.map((c) => ({
                  label: c.linkLabel || c.href || "(unknown)",
                  count: c._count._all,
                }))}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-sm font-medium text-ink">Visitors by country</p>
            <div className="mt-4">
              <HorizontalBarChart
                ariaLabel="Visitors by country"
                data={topCountries.map((c) => ({
                  label: c.countryName || c.countryCode || "Unknown",
                  count: c._count._all,
                }))}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="text-sm font-medium text-ink">Top referrers</p>
            <p className="text-xs text-ink-soft">Sites that linked here — excludes direct visits.</p>
            <div className="mt-4">
              <HorizontalBarChart
                ariaLabel="Top referrers"
                data={topReferrers.map((r) => ({ label: r.referrerHost || "Unknown", count: r._count._all }))}
              />
            </div>
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
