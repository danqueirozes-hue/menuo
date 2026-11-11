import { NextResponse } from "next/server";
import { requireAdminUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { hasEmailProvider, sendEmail } from "@/lib/email";
import { buildOnboardingEmail } from "@/lib/onboarding-email";

// Sends every variant of the onboarding nudge (en/pt/it × empty menu /
// menu with dishes) to the signed-in admin's own address, so the copy can be
// checked in a real inbox. Never touches other accounts or the "sent" flag.
export async function POST() {
  const adminUserId = await requireAdminUserId();
  if (!adminUserId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!hasEmailProvider()) {
    return NextResponse.json({ error: "Email provider not configured" }, { status: 503 });
  }

  const admin = await prisma.user.findUnique({ where: { id: adminUserId }, select: { email: true, name: true } });
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menuoglobal.com";
  const variants = [
    { lang: "it", restaurant: "Trattoria da Mario", dishCount: 0 },
    { lang: "it", restaurant: "Trattoria da Mario", dishCount: 12 },
    { lang: "pt", restaurant: "Tasca do Zé", dishCount: 0 },
    { lang: "pt", restaurant: "Tasca do Zé", dishCount: 12 },
    { lang: "en", restaurant: "The Corner Bistro", dishCount: 0 },
    { lang: "en", restaurant: "The Corner Bistro", dishCount: 12 },
  ];

  for (const v of variants) {
    const { subject, html } = buildOnboardingEmail({
      menuLanguage: v.lang,
      name: admin.name,
      restaurant: v.restaurant,
      dishCount: v.dishCount,
      dashboardUrl: `${siteUrl}/dashboard`,
    });
    await sendEmail({ to: admin.email, toName: admin.name, subject: `[Teste ${v.lang.toUpperCase()}] ${subject}`, html });
  }

  return NextResponse.json({ sent: variants.length, to: admin.email });
}
