import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireOwnedRestaurant, getSubscription, isSubscriptionActive } from "@/lib/session";
import { generateQrDataUrl } from "@/lib/qr";
import { PublishPanel } from "@/components/dashboard/PublishPanel";

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

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Publish & QR code</h1>
      <p className="mt-2 text-ink-soft">
        Publishing translates &quot;{menu.name}&quot; into 20 languages and
        makes it available at the link and QR code below.
      </p>
      <div className="mt-10">
        <PublishPanel
          menuId={menu.id}
          isPublished={menu.isPublished}
          canPublish={canPublish}
          publicUrl={publicUrl}
          qrDataUrl={qrDataUrl}
          restaurantName={restaurant.name}
          defaultLanguage={menu.defaultLanguage}
        />
      </div>
    </div>
  );
}
