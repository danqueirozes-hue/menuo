import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify, withRandomSuffix } from "@/lib/slug";
import { getCurrentUserId, getSubscription, getEffectiveLimits, requireOwnedMenu } from "@/lib/session";

// Copies a menu's structure (sections, dishes, prices, photos, dietary
// tags) into a brand-new draft menu on the same establishment. Deliberately
// does NOT copy isPublished/publishedAt (a duplicate always starts as an
// unpublished draft) or cached translations (SectionTranslation/
// ItemTranslation are keyed to the original section/item ids and would be
// meaningless on the copies — the new menu picks up fresh translations the
// first time it's published).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const source = await requireOwnedMenu(id, userId);
  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const subscription = await getSubscription(userId);
  const limits = getEffectiveLimits(subscription);
  const menuCount = await prisma.menu.count({ where: { restaurantId: source.restaurantId } });

  if (menuCount >= limits.maxMenusPerEstablishment) {
    return NextResponse.json(
      {
        error:
          limits.maxMenusPerEstablishment === 1
            ? "Your plan supports a single menu for this establishment. Upgrade to duplicate menus."
            : `Your plan supports up to ${limits.maxMenusPerEstablishment} menus per establishment.`,
        code: "MENU_LIMIT_REACHED",
      },
      { status: 403 }
    );
  }

  const name = `${source.name} (copy)`;
  let slug = slugify(`${source.restaurant.name}-${name}`);
  const slugTaken = await prisma.menu.findUnique({ where: { slug } });
  if (slugTaken || !slug) slug = withRandomSuffix(slug || "menu");

  const menu = await prisma.menu.create({
    data: {
      restaurantId: source.restaurantId,
      name,
      slug,
      defaultLanguage: source.defaultLanguage,
      sections: {
        create: source.sections.map((section) => ({
          name: section.name,
          position: section.position,
          items: {
            create: section.items.map((item) => ({
              name: item.name,
              description: item.description,
              priceCents: item.priceCents,
              photoUrl: item.photoUrl,
              position: item.position,
              isAvailable: item.isAvailable,
              isVegetarian: item.isVegetarian,
              isVegan: item.isVegan,
              isGlutenFree: item.isGlutenFree,
              hasSeafood: item.hasSeafood,
              isSpecialty: item.isSpecialty,
              isNew: item.isNew,
            })),
          },
        })),
      },
    },
  });

  return NextResponse.json(menu, { status: 201 });
}
