import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { requireOwnedRestaurant } from "@/lib/session";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const restaurant = await requireOwnedRestaurant(restaurantId, session.user.id);
  if (!restaurant) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Restaurant settings</h1>
      <p className="mt-2 text-ink-soft">
        This information appears on every menu published under this establishment.
      </p>
      <div className="mt-10">
        <SettingsForm restaurantId={restaurant.id} restaurant={restaurant} />
      </div>
    </div>
  );
}
