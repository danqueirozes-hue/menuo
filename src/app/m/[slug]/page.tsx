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

  // MENUO's brand font (Manrope) only covers Latin script. A guest's own
  // browser silently falls back to a system font for Arabic/CJK/Thai/
  // Devanagari, so it looks fine on screen — but the PDF export renders in a
  // headless Chromium on Netlify's serverless runtime, which has no system
  // fonts installed at all. Without an explicit webfont for these scripts,
  // that PDF shows blank boxes instead of characters. Loading Noto Sans's
  // per-script variants here (used for both the language picker and the
  // menu itself) fixes both screen and PDF rendering the same way.
  const nonLatinFontLink = (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Sans+Thai:wght@400;500;600&display=swap"
      precedence="default"
    />
  );

  if (!lang || !isValidLanguage(lang)) {
    return (
      <>
        {nonLatinFontLink}
        <LanguagePicker slug={slug} restaurantName={menu.restaurant.name} logoUrl={menu.restaurant.logoUrl} />
      </>
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

  return (
    <>
      {nonLatinFontLink}
      <MenuView restaurant={restaurant} lang={lang} print={print === "1"} />
    </>
  );
}
