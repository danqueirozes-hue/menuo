import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/plans";
import { builderLocale } from "@/lib/builder-content";
import { getDashboardContent } from "@/lib/dashboard-content";
import { Logo } from "@/components/ui/Logo";
import { AccountPanel } from "@/components/dashboard/AccountPanel";

const DATE_LOCALE = { en: "en-GB", pt: "pt-PT", it: "it-IT" } as const;

// Reachable even for new accounts that haven't picked a plan yet (they
// must still be able to delete their account), so it lives outside the
// establishment layout and its plan gate.
export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      restaurants: {
        orderBy: { createdAt: "asc" },
        take: 1,
        include: { menus: { orderBy: { createdAt: "asc" }, take: 1 } },
      },
    },
  });
  if (!user) redirect("/login");

  const menuLanguage = user.restaurants[0]?.menus[0]?.defaultLanguage;
  const t = getDashboardContent(menuLanguage).account;
  const fmt = new Intl.DateTimeFormat(DATE_LOCALE[builderLocale(menuLanguage)], { dateStyle: "long" });
  const sub = user.subscription;
  const firstRestaurant = user.restaurants[0];

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" prefetch={false}>
          <Logo className="h-7" />
        </Link>
        {firstRestaurant && (
          <Link href={`/dashboard/r/${firstRestaurant.id}`} prefetch={false} className="text-sm text-ink-soft hover:text-amber">
            {t.back}
          </Link>
        )}
      </div>

      <h1 className="font-display mt-8 text-3xl text-ink">{t.title}</h1>

      <AccountPanel
        dict={t}
        profile={{ name: user.name, email: user.email, memberSince: fmt.format(user.createdAt) }}
        subscription={
          sub
            ? {
                planName: getPlan(sub.plan)?.name ?? sub.plan,
                status: sub.status,
                cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
                periodEnd: sub.currentPeriodEnd ? fmt.format(sub.currentPeriodEnd) : null,
                hasBillingAccount: Boolean(sub.stripeCustomerId),
              }
            : null
        }
        canDelete={!user.isAdmin}
      />
    </div>
  );
}
