import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSubscription, getEffectiveLimits, getUserRestaurants } from "@/lib/session";
import { Logo } from "@/components/ui/Logo";
import { BillingPlans } from "@/components/dashboard/BillingPlans";
import { getBillingContent } from "@/lib/billing-content";
import { getRequestLocale } from "@/lib/request-locale";
import { prisma } from "@/lib/prisma";
import { mustChoosePlan } from "@/lib/billing-gate";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [subscription, restaurants, locale, user] = await Promise.all([
    getSubscription(session.user.id),
    getUserRestaurants(session.user.id),
    getRequestLocale(),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { createdAt: true, isAdmin: true } }),
  ]);
  // New accounts land here straight from signup and can't use the
  // dashboard until checkout — so no "back" link (it would bounce here).
  const gated = Boolean(user && mustChoosePlan(user, subscription));
  const limits = getEffectiveLimits(subscription);
  const menuCount = restaurants.reduce((n, r) => n + r.menus.length, 0);
  const text = getBillingContent(locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Logo className="h-7" />
        </Link>
        {restaurants[0] && !gated && (
          <Link href={`/dashboard/r/${restaurants[0].id}`} className="text-sm text-ink-soft hover:text-amber">
            {text.page.back}
          </Link>
        )}
      </div>

      {gated && (
        <div className="mt-8 rounded-2xl border border-amber/40 bg-amber-soft/15 p-6">
          <h2 className="font-display text-xl text-ink">{text.page.welcomeTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text.page.welcomeBody}</p>
        </div>
      )}

      <h1 className="font-display mt-8 text-3xl text-ink">{text.page.title}</h1>
      <p className="mt-2 text-ink-soft">
        {text.page.usage(
          restaurants.length,
          limits.maxEstablishments,
          menuCount,
          limits.maxEstablishments * limits.maxMenusPerEstablishment
        )}
      </p>

      <div className="mt-10">
        <Suspense>
          <BillingPlans
            dict={text.plans}
            currentPlan={subscription?.plan ?? null}
            status={subscription?.status ?? null}
            cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
            currentPeriodEnd={subscription?.currentPeriodEnd?.toISOString() ?? null}
            eligibleForTrial={!subscription?.stripeCustomerId}
          />
        </Suspense>
      </div>
    </div>
  );
}
