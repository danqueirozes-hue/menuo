import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSubscription, getEffectiveLimits, getUserRestaurants } from "@/lib/session";
import { Logo } from "@/components/ui/Logo";
import { BillingPlans } from "@/components/dashboard/BillingPlans";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [subscription, restaurants] = await Promise.all([
    getSubscription(session.user.id),
    getUserRestaurants(session.user.id),
  ]);
  const limits = getEffectiveLimits(subscription);
  const menuCount = restaurants.reduce((n, r) => n + r.menus.length, 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo className="h-7" />
        </Link>
        {restaurants[0] && (
          <Link href={`/dashboard/r/${restaurants[0].id}`} className="text-sm text-ink-soft hover:text-amber">
            ← Back to dashboard
          </Link>
        )}
      </div>

      <h1 className="font-display mt-8 text-3xl text-ink">Billing</h1>
      <p className="mt-2 text-ink-soft">
        {restaurants.length} of {limits.maxEstablishments} establishment
        {limits.maxEstablishments === 1 ? "" : "s"} · {menuCount} of{" "}
        {limits.maxEstablishments * limits.maxMenusPerEstablishment} menus used.
      </p>

      <div className="mt-10">
        <Suspense>
          <BillingPlans currentPlan={subscription?.plan ?? null} status={subscription?.status ?? null} />
        </Suspense>
      </div>
    </div>
  );
}
