import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { QrCode } from "lucide-react";
import { auth } from "@/lib/auth";
import { requireOwnedRestaurant } from "@/lib/session";

export default async function EstablishmentPublishPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const restaurant = await requireOwnedRestaurant(restaurantId, session.user.id);
  if (!restaurant) notFound();

  // Most establishments have exactly one menu — skip straight to its
  // publish/QR page instead of making them pick from a list of one.
  if (restaurant.menus.length === 1) {
    redirect(`/dashboard/r/${restaurantId}/menus/${restaurant.menus[0].id}/publish`);
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Publish & QR code</h1>
      <p className="mt-2 text-ink-soft">Choose which menu to publish and get its QR code.</p>

      {restaurant.menus.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-sm text-ink-soft">
          You don&apos;t have a menu yet.{" "}
          <Link href={`/dashboard/r/${restaurantId}`} className="text-amber hover:underline">
            Create your first menu
          </Link>
          .
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {restaurant.menus.map((menu) => (
            <Link
              key={menu.id}
              href={`/dashboard/r/${restaurantId}/menus/${menu.id}/publish`}
              className="flex items-center justify-between rounded-xl border border-border bg-panel p-5 hover:border-amber"
            >
              <div>
                <p className="font-display text-lg text-ink">{menu.name}</p>
                <p className="text-xs text-ink-soft">/m/{menu.slug}</p>
              </div>
              <span
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                  menu.isPublished ? "bg-green/15 text-green" : "bg-amber-soft/40 text-ink-soft"
                }`}
              >
                <QrCode size={14} />
                {menu.isPublished ? "Live" : "Draft"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
