import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { requireOwnedRestaurant, getSubscription, getEffectiveLimits } from "@/lib/session";
import { NewMenuForm } from "@/components/dashboard/NewMenuForm";
import { DuplicateMenuButton } from "@/components/dashboard/DuplicateMenuButton";
import { DeleteMenuButton } from "@/components/dashboard/DeleteMenuButton";

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

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">{restaurant.name} — Menus</h1>
      <p className="mt-2 text-ink-soft">
        {restaurant.menus.length} of {limits.maxMenusPerEstablishment} menu
        {limits.maxMenusPerEstablishment === 1 ? "" : "s"} used on your current plan.
      </p>

      <div className="mt-8 grid gap-4">
        {restaurant.menus.map((menu) => (
          <div
            key={menu.id}
            className="flex items-center justify-between rounded-xl border border-border bg-panel p-5 hover:border-amber"
          >
            <Link href={`/dashboard/r/${restaurantId}/menus/${menu.id}`} className="flex-1">
              <p className="font-display text-lg text-ink">{menu.name}</p>
              <p className="text-xs text-ink-soft">/m/{menu.slug}</p>
            </Link>
            <div className="flex items-center gap-3">
              <DuplicateMenuButton menuId={menu.id} restaurantId={restaurantId} disabled={!canAddMenu} />
              <DeleteMenuButton menuId={menu.id} menuName={menu.name} />
              <Link
                href={`/dashboard/r/${restaurantId}/menus/${menu.id}/publish`}
                className={`rounded-full px-3 py-1 text-xs hover:underline ${
                  menu.isPublished ? "bg-green/15 text-green" : "bg-amber-soft/40 text-ink-soft"
                }`}
              >
                {menu.isPublished ? "Live" : "Draft"} · Publish
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {canAddMenu ? (
          <NewMenuForm restaurantId={restaurantId} />
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-ink-soft">
            You&apos;ve reached the menu limit for your current plan.{" "}
            <Link href="/dashboard/billing" className="text-amber hover:underline">
              Upgrade to add more menus
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
