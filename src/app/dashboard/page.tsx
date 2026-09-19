import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserRestaurants } from "@/lib/session";

export default async function DashboardRootPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const restaurants = await getUserRestaurants(session.user.id);
  if (restaurants.length === 0) redirect("/login");

  redirect(`/dashboard/r/${restaurants[0].id}`);
}
