import { NextResponse } from "next/server";
import { requireAdminUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { hasEmailProvider, sendEmail } from "@/lib/email";
import { buildOnboardingEmail, buildTrialNudgeEmail, buildTrialWelcomeEmail } from "@/lib/onboarding-email";

// Sends the onboarding emails of the card-required flow ("choose your plan",
// "trial started", "trial running, menu empty") in en/pt/it to the signed-in
// admin's own address, so the copy can be checked in a real inbox. Never
// touches other accounts or the "sent" flags.
export async function POST() {
  const adminUserId = await requireAdminUserId();
  if (!adminUserId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!hasEmailProvider()) {
    return NextResponse.json({ error: "Email provider not configured" }, { status: 503 });
  }

  const admin = await prisma.user.findUnique({ where: { id: adminUserId }, select: { email: true, name: true } });
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menuoglobal.com";
  const dashboardUrl = `${siteUrl}/dashboard`;
  const sampleRestaurant: Record<string, string> = {
    it: "Trattoria da Mario",
    pt: "Tasca do Zé",
    en: "The Corner Bistro",
  };
  const trialEnd = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000);

  let sent = 0;
  for (const lang of ["it", "pt", "en"]) {
    const common = { menuLanguage: lang, name: admin.name, restaurant: sampleRestaurant[lang], dashboardUrl };
    const emails = [
      { label: "1 plano", ...buildOnboardingEmail({ ...common, dishCount: 0, cardRequired: true, billingUrl: `${siteUrl}/dashboard/billing` }) },
      { label: "2 boas-vindas", ...buildTrialWelcomeEmail({ ...common, trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }) },
      { label: "3 lembrete", ...buildTrialNudgeEmail({ ...common, trialEnd }) },
    ];
    for (const e of emails) {
      await sendEmail({
        to: admin.email,
        toName: admin.name,
        subject: `[Teste ${lang.toUpperCase()} · ${e.label}] ${e.subject}`,
        html: e.html,
      });
      sent++;
    }
  }

  return NextResponse.json({ sent, to: admin.email });
}
