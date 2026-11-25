import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireOwnedRestaurant } from "@/lib/session";
import { isNetlifyRuntime } from "@/lib/runtime";
import { allergenLabels } from "@/lib/allergens";
import { getDashboardContent } from "@/lib/dashboard-content";
import { MENU_IMPORT_LIMIT } from "@/lib/menu-import";
import { MenuImporter } from "@/components/dashboard/MenuImporter";

export default async function MenuImportPage({
  params,
}: {
  params: Promise<{ restaurantId: string; menuId: string }>;
}) {
  const { restaurantId, menuId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [restaurant, user] = await Promise.all([
    requireOwnedRestaurant(restaurantId, session.user.id),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true, menuImportCount: true } }),
  ]);
  const menu = restaurant?.menus.find((m) => m.id === menuId);
  if (!restaurant || !menu || !user) notFound();

  const t = getDashboardContent(menu.defaultLanguage).menuImport;
  const builderHref = `/dashboard/r/${restaurantId}/menus/${menuId}`;

  return (
    <div>
      <Link href={builderHref} prefetch={false} className="text-sm text-ink-soft hover:text-amber">
        {t.back}
      </Link>
      <h1 className="font-display mt-4 text-3xl text-ink">{t.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{t.intro}</p>
      <div className="mt-8">
        <MenuImporter
          dict={t}
          menuId={menuId}
          builderHref={builderHref}
          available={Boolean(process.env.ANTHROPIC_API_KEY) && isNetlifyRuntime()}
          remaining={user.isAdmin ? null : Math.max(0, MENU_IMPORT_LIMIT - user.menuImportCount)}
          currency={restaurant.currency}
          allergenNames={allergenLabels(menu.defaultLanguage)}
        />
      </div>
    </div>
  );
}
