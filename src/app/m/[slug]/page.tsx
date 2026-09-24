import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isValidLanguage } from "@/lib/languages";
import { LanguagePicker } from "@/components/menu/LanguagePicker";
import { MenuView } from "@/components/menu/MenuView";

export default async function PublicMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; print?: string }>;
}) {
  const { slug } = await params;
  const { lang, print } = await searchParams;

  const menu = await prisma.menu.findUnique({
    where: { slug },
    include: {
      restaurant: true,
      sections: {
        orderBy: { position: "asc" },
        include: {
          translations: true,
          items: {
            where: { isAvailable: true },
            orderBy: { position: "asc" },
            include: {
              translations: true,
              variants: { orderBy: { position: "asc" }, include: { translations: true } },
            },
          },
        },
      },
    },
  });

  if (!menu || !menu.isPublished) notFound();

  if (!lang || !isValidLanguage(lang)) {
    return (
      <LanguagePicker slug={slug} restaurantName={menu.restaurant.name} logoUrl={menu.restaurant.logoUrl} />
    );
  }

  const restaurant = {
    name: menu.restaurant.name,
    logoUrl: menu.restaurant.logoUrl,
    address: menu.restaurant.address,
    city: menu.restaurant.city,
    country: menu.restaurant.country,
    currency: menu.restaurant.currency,
    defaultLanguage: menu.defaultLanguage,
    slug: menu.slug,
    sections: menu.sections,
  };

  return <MenuView restaurant={restaurant} lang={lang} print={print === "1"} />;
}
