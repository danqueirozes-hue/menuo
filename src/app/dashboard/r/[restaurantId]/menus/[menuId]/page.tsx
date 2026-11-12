import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FileUp, QrCode } from "lucide-react";
import { getDashboardContent } from "@/lib/dashboard-content";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireOwnedRestaurant } from "@/lib/session";
import { MenuBuilder } from "@/components/dashboard/MenuBuilder";
import { MenuSettingsBar } from "@/components/dashboard/MenuSettingsBar";
import { getBuilderContent } from "@/lib/builder-content";

export default async function MenuBuilderPage({
  params,
}: {
  params: Promise<{ restaurantId: string; menuId: string }>;
}) {
  const { restaurantId, menuId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const restaurant = await requireOwnedRestaurant(restaurantId, session.user.id);
  if (!restaurant) notFound();

  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
    include: {
      sections: {
        orderBy: { position: "asc" },
        include: {
          items: {
            orderBy: { position: "asc" },
            include: { variants: { orderBy: { position: "asc" } } },
          },
        },
      },
    },
  });
  if (!menu || menu.restaurantId !== restaurantId) notFound();

  const dict = getBuilderContent(menu.defaultLanguage);

  const sections = menu.sections.map((s) => ({
    id: s.id,
    name: s.name,
    position: s.position,
    items: s.items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description ?? "",
      priceCents: i.priceCents,
      hasVariants: i.hasVariants,
      variants: i.variants.map((v) => ({
        id: v.id,
        label: v.label,
        priceCents: v.priceCents,
        position: v.position,
      })),
      photoUrl: i.photoUrl,
      position: i.position,
      isAvailable: i.isAvailable,
      isVegetarian: i.isVegetarian,
      isVegan: i.isVegan,
      isGlutenFree: i.isGlutenFree,
      hasSeafood: i.hasSeafood,
      isSpecialty: i.isSpecialty,
      isNew: i.isNew,
      allergens: i.allergens,
      allergensConfirmed: i.allergensConfirmed,
    })),
  }));

  return (
    <div>
      <MenuSettingsBar
        menuId={menu.id}
        name={menu.name}
        defaultLanguage={menu.defaultLanguage}
        label={dict.sourceLanguage}
        languageOptions={dict.languageOptions}
      />
      <div className="-mt-4 mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-soft">{dict.intro}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/r/${restaurantId}/menus/${menu.id}/import`}
            prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm text-ink hover:border-amber hover:text-amber"
          >
            <FileUp size={16} />
            {getDashboardContent(menu.defaultLanguage).menuImport.entry}
          </Link>
          <Link
            href={`/dashboard/r/${restaurantId}/menus/${menu.id}/publish`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-paper hover:bg-navy-soft"
          >
            <QrCode size={16} />
            {menu.isPublished ? dict.republishCta : dict.publishCta}
          </Link>
        </div>
      </div>

      <MenuBuilder menuId={menu.id} initialSections={sections} currency={restaurant.currency} dict={dict} />
    </div>
  );
}
