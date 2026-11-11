import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSubscriptionActive } from "@/lib/session";
import { hasEmailProvider, sendEmail } from "@/lib/email";
import { buildOnboardingEmail, buildTrialNudgeEmail } from "@/lib/onboarding-email";
import { isCronRequest } from "@/lib/cron-auth";
import { isCardRequiredAccount } from "@/lib/billing-gate";

// Called hourly by the netlify/functions/onboarding-email scheduled function.
// 1. Accounts created 3 h – 14 days ago with no live menu and no plan get
//    one onboarding email (User.onboardingEmailSentAt) — "choose your plan"
//    for card-required accounts, "build your menu" for older ones.
// 2. Accounts 48 h+ into a free trial with no dishes yet get one nudge
//    (User.trialNudgeSentAt).
const HOUR = 60 * 60 * 1000;
const MIN_AGE_MS = 3 * HOUR;
const MAX_AGE_MS = 14 * 24 * HOUR;
const TRIAL_NUDGE_AFTER_MS = 48 * HOUR;
const BATCH = 20;

type Result = { id: string; email: "onboarding" | "trialNudge"; status: "sent" | "skipped" | "failed" };

const userInclude = {
  subscription: true,
  restaurants: {
    orderBy: { createdAt: "asc" as const },
    include: { menus: { orderBy: { createdAt: "asc" as const } } },
  },
};

function dishCountFor(userId: string) {
  return prisma.menuItem.count({ where: { section: { menu: { restaurant: { ownerId: userId } } } } });
}

export async function POST(req: Request) {
  if (!isCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasEmailProvider()) {
    return NextResponse.json({ error: "Email provider not configured" }, { status: 503 });
  }

  const now = Date.now();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menuoglobal.com";
  const results: Result[] = [];

  async function deliver(
    user: { id: string; email: string; name: string },
    email: Result["email"],
    content: { subject: string; html: string },
    flag: "onboardingEmailSentAt" | "trialNudgeSentAt"
  ) {
    try {
      await sendEmail({ to: user.email, toName: user.name, ...content });
      await prisma.user.update({ where: { id: user.id }, data: { [flag]: new Date() } });
      results.push({ id: user.id, email, status: "sent" });
    } catch (err) {
      // Left unmarked, so the next hourly run retries it.
      console.error(`[onboarding-email] ${email} failed for ${user.id}:`, err);
      results.push({ id: user.id, email, status: "failed" });
    }
  }

  // 1. Onboarding email for accounts that never got going.
  const recent = await prisma.user.findMany({
    where: {
      isAdmin: false,
      onboardingEmailSentAt: null,
      createdAt: { gte: new Date(now - MAX_AGE_MS), lte: new Date(now - MIN_AGE_MS) },
    },
    orderBy: { createdAt: "asc" },
    take: BATCH,
    include: userInclude,
  });

  for (const user of recent) {
    const restaurant = user.restaurants[0];
    const live = user.restaurants.some((r) => r.menus.some((m) => m.isPublished));
    // Nothing to nudge: already live, or already on a plan (the trial nudge
    // below covers those) — mark as handled so they're never picked again.
    if (!restaurant || live || isSubscriptionActive(user.subscription)) {
      await prisma.user.update({ where: { id: user.id }, data: { onboardingEmailSentAt: new Date() } });
      results.push({ id: user.id, email: "onboarding", status: "skipped" });
      continue;
    }
    const content = buildOnboardingEmail({
      menuLanguage: restaurant.menus[0]?.defaultLanguage,
      name: user.name,
      restaurant: restaurant.name,
      dishCount: await dishCountFor(user.id),
      cardRequired: isCardRequiredAccount(user),
      dashboardUrl: `${siteUrl}/dashboard`,
      billingUrl: `${siteUrl}/dashboard/billing`,
    });
    await deliver(user, "onboarding", content, "onboardingEmailSentAt");
  }

  // 2. Trial running for 48 h+ and the menu is still empty.
  const trialing = await prisma.user.findMany({
    where: {
      isAdmin: false,
      trialNudgeSentAt: null,
      subscription: { status: "trialing", createdAt: { lte: new Date(now - TRIAL_NUDGE_AFTER_MS) } },
    },
    take: BATCH,
    include: userInclude,
  });

  for (const user of trialing) {
    const restaurant = user.restaurants[0];
    const trialEnd = user.subscription?.currentPeriodEnd;
    const hasDishes = (await dishCountFor(user.id)) > 0;
    if (!restaurant || !trialEnd || trialEnd.getTime() <= now || hasDishes) {
      await prisma.user.update({ where: { id: user.id }, data: { trialNudgeSentAt: new Date() } });
      results.push({ id: user.id, email: "trialNudge", status: "skipped" });
      continue;
    }
    const content = buildTrialNudgeEmail({
      menuLanguage: restaurant.menus[0]?.defaultLanguage,
      name: user.name,
      restaurant: restaurant.name,
      trialEnd,
      dashboardUrl: `${siteUrl}/dashboard`,
    });
    await deliver(user, "trialNudge", content, "trialNudgeSentAt");
  }

  return NextResponse.json({ processed: results.length, results });
}
