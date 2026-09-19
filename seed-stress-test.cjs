const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const menuId = "cmu8jhnl50002kyqkox64swjx";
  const section = await prisma.menuSection.create({
    data: {
      menuId,
      name: "Stress Test",
      position: 99,
      items: {
        create: Array.from({ length: 20 }, (_, i) => ({
          name: `Test Dish ${i + 1}`,
          description: `A delicious test description for dish number ${i + 1} with several words to translate`,
          priceCents: 1000 + i * 50,
          position: i,
        })),
      },
    },
  });
  console.log("SECTION_ID=" + section.id);
}

main().finally(() => prisma.$disconnect());
