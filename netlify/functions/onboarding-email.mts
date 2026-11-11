import { createHmac } from "node:crypto";

// Netlify Scheduled Function: once an hour, asks the app to send the
// "finish setting up your menu" email to recent signups that haven't
// published yet. The actual logic (Prisma + ZeptoMail) lives in the Next.js
// route /api/cron/onboarding-email; this only triggers it. The shared key is
// CRON_SECRET when set, otherwise derived from AUTH_SECRET (same rule as
// src/lib/cron-auth.ts) so no extra secret has to be configured.
function cronKey(): string {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET;
  return createHmac("sha256", process.env.AUTH_SECRET ?? "").update("menuo-cron").digest("hex");
}

export default async () => {
  const base = process.env.URL || "https://menuoglobal.com";
  const res = await fetch(`${base}/api/cron/onboarding-email`, {
    method: "POST",
    headers: { "x-cron-secret": cronKey() },
  });
  console.log("[onboarding-email]", res.status, await res.text());
};

export const config = { schedule: "@hourly" };
