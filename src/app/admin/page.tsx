import { prisma } from "@/lib/prisma";
import { getPlan, priceCentsFor, BillingInterval } from "@/lib/plans";
import { formatPrice } from "@/lib/currency";
import { AdminAccountsTable, AdminAccountRow } from "@/components/admin/AdminAccountsTable";

export default async function AdminPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscription: true,
      restaurants: { select: { id: true, name: true } },
    },
  });

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

      {Object.keys(byPlan).length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(byPlan).map(([planKey, count]) => (
            <span
              key={planKey}
              className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-ink-soft"
            >
              {getPlan(planKey)?.name ?? planKey}: <span className="font-medium text-ink">{count}</span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-xl text-ink">All accounts</h2>
        <div className="mt-4">
          <AdminAccountsTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
