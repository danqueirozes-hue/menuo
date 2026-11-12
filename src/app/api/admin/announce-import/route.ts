import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { hasEmailProvider, sendEmail } from "@/lib/email";
import { isNetlifyRuntime } from "@/lib/runtime";
import {
  IMPORT_ANNOUNCEMENT_ID,
  IMPORT_ANNOUNCEMENT_RECIPIENTS,
  buildImportAnnouncementEmail,
} from "@/lib/announcement-email";

const schema = z.object({ mode: z.enum(["preview", "send"]) });

async function sentStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: "announcements", consistency: "strong" });
}

/** Admin-only. "preview" emails the announcement to the admin; "send" emails
 * the listed restaurants — once (a Netlify Blobs flag blocks a second send). */
export async function POST(req: Request) {
  const adminUserId = await requireAdminUserId();
  if (!adminUserId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!hasEmailProvider() || !isNetlifyRuntime()) {
    return NextResponse.json({ error: "Email provider not configured" }, { status: 503 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menuoglobal.com";

  if (parsed.data.mode === "preview") {
    const admin = await prisma.user.findUnique({ where: { id: adminUserId }, select: { email: true, name: true } });
    if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { subject, html } = buildImportAnnouncementEmail(admin.name.split(/\s+/)[0] || admin.name, siteUrl);
    await sendEmail({ to: admin.email, toName: admin.name, subject: `[Teste] ${subject}`, html });
    return NextResponse.json({ sent: 1, to: [admin.email] });
  }

  const store = await sentStore();
  if (await store.get(IMPORT_ANNOUNCEMENT_ID)) {
    return NextResponse.json({ error: "Already sent" }, { status: 409 });
  }
  const results: { email: string; ok: boolean }[] = [];
  for (const r of IMPORT_ANNOUNCEMENT_RECIPIENTS) {
    const { subject, html } = buildImportAnnouncementEmail(r.greeting, siteUrl);
    try {
      await sendEmail({ to: r.email, toName: r.greeting, subject, html });
      results.push({ email: r.email, ok: true });
    } catch (err) {
      console.error(`[announce-import] failed for ${r.email}:`, err);
      results.push({ email: r.email, ok: false });
    }
  }
  if (results.some((r) => r.ok)) {
    await store.setJSON(IMPORT_ANNOUNCEMENT_ID, { sentAt: new Date().toISOString(), results });
  }
  return NextResponse.json({ results });
}
