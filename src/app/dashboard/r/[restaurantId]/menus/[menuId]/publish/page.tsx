import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireOwnedRestaurant, getSubscription, isSubscriptionActive } from "@/lib/session";
import { generateQrDataUrl } from "@/lib/qr";
import { PublishPanel } from "@/components/dashboard/PublishPanel";
import { getDashboardContent } from "@/lib/dashboard-content";

export default async function PublishPage({
  params,
}: {
  params: Promise<{ restaurantId: string; menuId: string }>;
}) {
  const { restaurantId, menuId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const restaurant = await requireOwnedRestaurant(restaurantId, session.user.id);
  if (!restaurant) notFound();

  const menu = await prisma.menu.findUnique({ where: { id: menuId } });
  if (!menu || menu.restaurantId !== restaurantId) notFound();

  const subscription = await getSubscription(session.user.id);
  const canPublish = isSubscriptionActive(subscription);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const publicUrl = `${siteUrl}/m/${menu.slug}`;
  const qrDataUrl = menu.isPublished ? await generateQrDataUrl(publicUrl) : null;

  // Same rule as the builder: this menu's own source language.
  const dict = getDashboardContent(menu.defaultLanguage);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">{dict.publish.title}</h1>
      <p className="mt-2 text-ink-soft">{dict.publish.intro.replace("{name}", menu.name)}</p>
      <div className="mt-10">
        <PublishPanel
          menuId={menu.id}
          isPublished={menu.isPublished}
          canPublish={canPublish}
          publicUrl={publicUrl}
          qrDataUrl={qrDataUrl}
          restaurantName={restaurant.name}
          defaultLanguage={menu.defaultLanguage}
          dict={dict.publish}
          languageOptions={dict.newMenu.languageOptions}
        />
      </div>
    </div>
  );
}
