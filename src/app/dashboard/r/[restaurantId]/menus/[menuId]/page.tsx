import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { QrCode } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireOwnedRestaurant } from "@/lib/session";
import { MenuBuilder } from "@/components/dashboard/MenuBuilder";
import { MenuSettingsBar } from "@/components/dashboard/MenuSettingsBar";

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
        include: { items: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!menu || menu.restaurantId !== restaurantId) notFound();

  const sections = menu.sections.map((s) => ({
    id: s.id,
    name: s.name,
    position: s.position,
    items: s.items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description ?? "",
      priceCents: i.priceCents,
      photoUrl: i.photoUrl,
      position: i.position,
      isAvailable: i.isAvailable,
      isVegetarian: i.isVegetarian,
      isVegan: i.isVegan,
      isGlutenFree: i.isGlutenFree,
      hasSeafood: i.hasSeafood,
      isSpecialty: i.isSpecialty,
      isNew: i.isNew,
    })),
  }));

  return (
    <div>
      <MenuSettingsBar menuId={menu.id} name={menu.name} defaultLanguage={menu.defaultLanguage} />
      <div className="-mt-4 mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-soft">
          Add sections and dishes. Changes are saved automatically — publish
          when you&apos;re ready to generate your QR code.
        </p>
        <Link
          href={`/dashboard/r/${restaurantId}/menus/${menu.id}/publish`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-paper hover:bg-navy-soft"
        >
          <QrCode size={16} />
          {menu.isPublished ? "Publish & QR code" : "Publish this menu"}
        </Link>
      </div>

      <MenuBuilder menuId={menu.id} initialSections={sections} currency={restaurant.currency} />
    </div>
  );
}
