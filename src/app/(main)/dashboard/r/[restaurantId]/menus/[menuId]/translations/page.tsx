import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireOwnedRestaurant } from "@/lib/session";
import { getDashboardContent } from "@/lib/dashboard-content";
import { LANGUAGES, isValidLanguage } from "@/lib/languages";
import { TranslationsEditor } from "@/components/dashboard/TranslationsEditor";

export default async function TranslationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string; menuId: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { restaurantId, menuId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!(await requireOwnedRestaurant(restaurantId, session.user.id))) notFound();

  const menu = await prisma.menu.findUnique({ where: { id: menuId }, select: { restaurantId: true, defaultLanguage: true } });
  if (!menu || menu.restaurantId !== restaurantId) notFound();

  const { lang: requested } = await searchParams;
  const targets = LANGUAGES.filter((l) => l.code !== menu.defaultLanguage).map((l) => l.code);
  const lang = requested && isValidLanguage(requested) && targets.includes(requested) ? requested : targets[0];

  const full = await prisma.menu.findUniqueOrThrow({
    where: { id: menuId },
    select: {
      id: true,
      keepOriginalNames: true,
      sections: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          name: true,
          translations: { where: { language: lang }, select: { name: true } },
          items: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              name: true,
              description: true,
              translations: { where: { language: lang }, select: { name: true, description: true } },
            },
          },
        },
      },
    },
  });

  const dashboard = getDashboardContent(menu.defaultLanguage);
  const dict = dashboard.translations;
  const languages = dashboard.newMenu.languageOptions.filter((o) => targets.includes(o.code));

  return (
    <div className="max-w-4xl">
      <Link
        href={`/dashboard/r/${restaurantId}/menus/${menuId}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-amber"
      >
        <ArrowLeft size={15} /> {dict.back}
      </Link>
      <h1 className="font-display mt-4 text-3xl text-ink">{dict.title}</h1>
      <p className="mt-2 text-ink-soft">{dict.intro}</p>
      <TranslationsEditor
        key={lang}
        menuId={full.id}
        lang={lang}
        languages={languages}
        keepOriginalNames={full.keepOriginalNames}
        sections={full.sections.map((s) => ({
          id: s.id,
          name: s.name,
          translated: s.translations[0]?.name ?? "",
          items: s.items.map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description ?? "",
            tName: i.translations[0]?.name ?? "",
            tDescription: i.translations[0]?.description ?? "",
          })),
        }))}
        dict={dict}
      />
    </div>
  );
}
