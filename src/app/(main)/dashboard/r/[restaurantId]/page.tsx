import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  requireOwnedRestaurant,
  getSubscription,
  getEffectiveLimits,
  isSubscriptionActive,
} from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GettingStarted } from "@/components/dashboard/GettingStarted";
import { NewMenuForm } from "@/components/dashboard/NewMenuForm";
import { DuplicateMenuButton } from "@/components/dashboard/DuplicateMenuButton";
import { DeleteMenuButton } from "@/components/dashboard/DeleteMenuButton";
import { MenuNameCell } from "@/components/dashboard/MenuNameCell";
import { getDashboardContent } from "@/lib/dashboard-content";

export default async function MenusListPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const restaurant = await requireOwnedRestaurant(restaurantId, session.user.id);
  if (!restaurant) notFound();

  const subscription = await getSubscription(session.user.id);
  const limits = getEffectiveLimits(subscription);
  const canAddMenu = restaurant.menus.length < limits.maxMenusPerEstablishment;
  const dict = getDashboardContent(restaurant.menus[0]?.defaultLanguage);
  const t = dict.menus;
  const max = limits.maxMenusPerEstablishment;

  // First-run checklist: only until this establishment has a live menu.
  const firstMenu = restaurant.menus[0];
  const showGuide = firstMenu && !restaurant.menus.some((m) => m.isPublished);
  const [sectionCount, itemCount] = showGuide
    ? await Promise.all([
        prisma.menuSection.count({ where: { menuId: firstMenu.id } }),
        prisma.menuItem.count({ where: { section: { menuId: firstMenu.id } } }),
      ])
    : [0, 0];
  const builderHref = firstMenu ? `/dashboard/r/${restaurantId}/menus/${firstMenu.id}` : "";

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">{t.title.replace("{name}", restaurant.name)}</h1>
      <p className="mt-2 text-ink-soft">
        {(max === 1 ? t.usedOne : t.usedOther)
          .replace("{used}", String(restaurant.menus.length))
          .replace("{max}", String(max))}
      </p>

      {showGuide && (
        <div className="mt-8">
          <GettingStarted
            dict={dict.onboarding}
            done={{
              section: sectionCount > 0,
              dish: itemCount > 0,
              trial: isSubscriptionActive(subscription),
              publish: false,
            }}
            hrefs={{
              section: builderHref,
              dish: builderHref,
              trial: "/dashboard/billing",
              publish: `${builderHref}/publish`,
            }}
            importLink={{ href: `${builderHref}/import`, label: dict.menuImport.entry }}
          />
        </div>
      )}

      <div className="mt-8 grid gap-4">
        {restaurant.menus.map((menu) => (
          <div
            key={menu.id}
            className="flex items-center justify-between rounded-xl border border-border bg-panel p-5 hover:border-amber"
          >
            <MenuNameCell restaurantId={restaurantId} menuId={menu.id} name={menu.name} slug={menu.slug} dict={t} />
            <div className="flex items-center gap-3">
              <DuplicateMenuButton menuId={menu.id} restaurantId={restaurantId} disabled={!canAddMenu} dict={t} />
              <DeleteMenuButton menuId={menu.id} menuName={menu.name} dict={t} />
              <Link
                href={`/dashboard/r/${restaurantId}/menus/${menu.id}/publish`}
                className={`rounded-full px-3 py-1 text-xs hover:underline ${
                  menu.isPublished ? "bg-green/15 text-green" : "bg-amber-soft/40 text-ink-soft"
                }`}
              >
                {menu.isPublished ? t.live : t.draft} · {t.publish}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {canAddMenu ? (
          <NewMenuForm restaurantId={restaurantId} dict={dict.newMenu} />
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-ink-soft">
            {t.limitReached}{" "}
            <Link href="/dashboard/billing" className="text-amber hover:underline">
              {t.upgradeMenus}
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
