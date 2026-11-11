import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSubscriptionActive } from "@/lib/session";
import { hasEmailProvider, sendEmail } from "@/lib/email";
import { buildOnboardingEmail } from "@/lib/onboarding-email";
import { isCronRequest } from "@/lib/cron-auth";

// Called hourly by the netlify/functions/onboarding-email scheduled function.
// Emails accounts created 3 h – 14 days ago that still have no live menu,
// once each (User.onboardingEmailSentAt).
const MIN_AGE_MS = 3 * 60 * 60 * 1000;
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const BATCH = 20;

export async function POST(req: Request) {
  if (!isCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasEmailProvider()) {
    return NextResponse.json({ error: "Email provider not configured" }, { status: 503 });
  }

  const now = Date.now();
  const users = await prisma.user.findMany({
    where: {
      isAdmin: false,
      onboardingEmailSentAt: null,
      createdAt: { gte: new Date(now - MAX_AGE_MS), lte: new Date(now - MIN_AGE_MS) },
    },
    orderBy: { createdAt: "asc" },
    take: BATCH,
    include: {
      subscription: true,
      restaurants: {
        orderBy: { createdAt: "asc" },
        include: { menus: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menuoglobal.com";
  const results: { id: string; status: "sent" | "skipped" | "failed" }[] = [];

  for (const user of users) {
    const restaurant = user.restaurants[0];
    const menus = user.restaurants.flatMap((r) => r.menus);
    const live = menus.some((m) => m.isPublished);
    // Nothing to nudge: already live, or already on a plan (they've seen
    // the publish step) — mark as handled so they're never picked again.
    if (!restaurant || live || isSubscriptionActive(user.subscription)) {
      await prisma.user.update({ where: { id: user.id }, data: { onboardingEmailSentAt: new Date() } });
      results.push({ id: user.id, status: "skipped" });
      continue;
    }

    const dishCount = await prisma.menuItem.count({
      where: { section: { menu: { restaurant: { ownerId: user.id } } } },
    });
    const { subject, html } = buildOnboardingEmail({
      menuLanguage: restaurant.menus[0]?.defaultLanguage,
      name: user.name,
      restaurant: restaurant.name,
      dishCount,
      dashboardUrl: `${siteUrl}/dashboard`,
    });

    try {
      await sendEmail({ to: user.email, toName: user.name, subject, html });
      await prisma.user.update({ where: { id: user.id }, data: { onboardingEmailSentAt: new Date() } });
      results.push({ id: user.id, status: "sent" });
    } catch (err) {
      // Left unmarked, so the next hourly run retries it.
      console.error(`[onboarding-email] failed for ${user.id}:`, err);
      results.push({ id: user.id, status: "failed" });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
