import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { requireOwnedRestaurant } from "@/lib/session";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { getDashboardContent } from "@/lib/dashboard-content";

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

  const t = getDashboardContent(restaurant.menus[0]?.defaultLanguage).settings;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">{t.title}</h1>
      <p className="mt-2 text-ink-soft">{t.subtitle}</p>
      <div className="mt-10">
        <SettingsForm restaurantId={restaurant.id} restaurant={restaurant} dict={t} />
      </div>
    </div>
  );
}
