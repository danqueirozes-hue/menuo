/**
 * Creates (or refreshes) the public sample menu used by the landing page's
 * live demo: "Trattoria Bella Vista", Italian original, translated into every
 * language. Owned by a dedicated demo account that can't log in.
 *
 *   npx tsx --env-file=.env scripts/seed-demo-menu.ts
 *
 * Re-running is safe: the menu is rebuilt from scratch and re-translated.
 */
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { runTranslationBatch } from "@/lib/translation-progress";
import { DEMO_ACCOUNT_EMAIL, DEMO_MENU_SLUG } from "@/lib/demo";

type Dish = {
  name: string;
  description: string;
  price: number;
  photo: string;
  allergens: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  hasSeafood?: boolean;
  isSpecialty?: boolean;
};

const MENU: { section: string; dishes: Dish[] }[] = [
  {
    section: "Antipasti",
    dishes: [
      {
        name: "Bruschetta al pomodoro",
        description: "Pane casereccio tostato, pomodorini, aglio, basilico e olio extravergine d'oliva.",
        price: 700,
        photo: "bruschetta",
        allergens: ["gluten"],
        isVegetarian: true,
        isVegan: true,
      },
      {
        name: "Tagliere di salumi e formaggi",
        description: "Prosciutto crudo, salame, pecorino e mozzarella di bufala, con miele e noci.",
        price: 1600,
        photo: "tagliere",
        allergens: ["milk", "nuts"],
      },
    ],
  },
  {
    section: "Primi",
    dishes: [
      {
        name: "Spaghetti alla carbonara",
        description: "Guanciale croccante, tuorlo d'uovo, pecorino romano e pepe nero.",
        price: 1300,
        photo: "carbonara",
        allergens: ["gluten", "eggs", "milk"],
        isSpecialty: true,
      },
      {
        name: "Tagliatelle al ragù",
        description: "Pasta all'uovo fatta in casa con ragù di manzo cotto a fuoco lento.",
        price: 1400,
        photo: "ragu",
        allergens: ["gluten", "eggs", "celery"],
      },
      {
        name: "Risotto ai frutti di mare",
        description: "Riso Carnaroli con gamberi, cozze e vongole, sfumato al vino bianco.",
        price: 1800,
        photo: "risotto",
        allergens: ["crustaceans", "molluscs", "sulphites"],
        isGlutenFree: true,
        hasSeafood: true,
      },
    ],
  },
  {
    section: "Pizze",
    dishes: [
      {
        name: "Margherita",
        description: "Pomodoro San Marzano, mozzarella fior di latte e basilico fresco.",
        price: 900,
        photo: "margherita",
        allergens: ["gluten", "milk"],
        isVegetarian: true,
      },
      {
        name: "Diavola",
        description: "Pomodoro, mozzarella fior di latte e salame piccante.",
        price: 1100,
        photo: "diavola",
        allergens: ["gluten", "milk"],
      },
    ],
  },
  {
    section: "Dolci",
    dishes: [
      {
        name: "Tiramisù",
        description: "Savoiardi, mascarpone, caffè espresso e cacao amaro.",
        price: 700,
        photo: "tiramisu",
        allergens: ["gluten", "eggs", "milk"],
        isVegetarian: true,
        isSpecialty: true,
      },
      {
        name: "Panna cotta ai frutti di bosco",
        description: "Panna cotta alla vaniglia con composta di frutti di bosco.",
        price: 600,
        photo: "pannacotta",
        allergens: ["milk"],
        isVegetarian: true,
        isGlutenFree: true,
      },
    ],
  },
];

async function main() {
  const now = new Date();
  // Unusable password hash: nobody can log into the demo account. The two
  // timestamps keep the onboarding/trial emails from ever targeting it.
  const user = await prisma.user.upsert({
    where: { email: DEMO_ACCOUNT_EMAIL },
    create: {
      email: DEMO_ACCOUNT_EMAIL,
      name: "MENUO Demo",
      passwordHash: `!disabled-${randomBytes(16).toString("hex")}`,
      onboardingEmailSentAt: now,
      trialNudgeSentAt: now,
    },
    update: {},
  });

  let restaurant = await prisma.restaurant.findFirst({ where: { ownerId: user.id } });
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: { ownerId: user.id, name: "Trattoria Bella Vista", city: "Roma", country: "Italia", currency: "EUR" },
    });
  }

  await prisma.menu.deleteMany({ where: { slug: DEMO_MENU_SLUG } });
  const menu = await prisma.menu.create({
    data: {
      restaurantId: restaurant.id,
      name: "Menu",
      slug: DEMO_MENU_SLUG,
      defaultLanguage: "it",
      isPublished: true,
      publishedAt: now,
      sections: {
        create: MENU.map((s, si) => ({
          name: s.section,
          position: si,
          items: {
            create: s.dishes.map((d, di) => ({
              name: d.name,
              description: d.description,
              priceCents: d.price,
              photoUrl: `/images/demo/${d.photo}.jpg`,
              position: di,
              allergens: d.allergens,
              allergensConfirmed: true,
              isVegetarian: d.isVegetarian ?? false,
              isVegan: d.isVegan ?? false,
              isGlutenFree: d.isGlutenFree ?? false,
              hasSeafood: d.hasSeafood ?? false,
              isSpecialty: d.isSpecialty ?? false,
            })),
          },
        })),
      },
    },
  });

  const content = await prisma.menu.findUniqueOrThrow({
    where: { id: menu.id },
    include: { sections: { include: { items: { include: { variants: true } } } } },
  });
  for (;;) {
    const { remaining, translatedInBatch } = await runTranslationBatch(content);
    console.log(`translated ${translatedInBatch}, remaining ${remaining}`);
    if (remaining === 0) break;
    if (translatedInBatch === 0) throw new Error("Translation made no progress — check the provider keys.");
  }
  console.log(`Demo menu ready: /m/${DEMO_MENU_SLUG}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
