import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify, withRandomSuffix } from "@/lib/slug";
import { isValidLanguage } from "@/lib/languages";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  restaurantName: z.string().min(2),
  defaultLanguage: z.string().refine(isValidLanguage, "Unsupported language"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { name, email, password, restaurantName, defaultLanguage } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let slug = slugify(restaurantName);
  const slugTaken = await prisma.menu.findUnique({ where: { slug } });
  if (slugTaken || !slug) slug = withRandomSuffix(slug || "menu");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      restaurants: {
        create: {
          name: restaurantName,
          menus: {
            create: {
              name: "Main Menu",
              slug,
              defaultLanguage,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}
