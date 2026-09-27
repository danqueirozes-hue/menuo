import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, hasEmailProvider } from "@/lib/email";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/reset-token";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always the same response whether or not the account exists — otherwise
  // this endpoint becomes a way to check which emails have accounts.
  if (user) {
    const { raw, hash } = generateResetToken();
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hash, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${siteUrl}/reset-password?token=${raw}`;

    if (hasEmailProvider()) {
      await sendEmail({
        to: user.email,
        toName: user.name,
        subject: "Reset your MENUO password",
        html: `
          <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; padding: 8px;">
            <h2 style="color:#0b2d5b; margin-bottom: 4px;">Reset your password</h2>
            <p style="color:#333; line-height: 1.5;">
              We received a request to reset the password for your MENUO account (${user.email}).
            </p>
            <p style="margin: 28px 0;">
              <a href="${resetUrl}" style="display:inline-block;background:#ffb020;color:#0b2d5b;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">
                Choose a new password
              </a>
            </p>
            <p style="color:#777; font-size:13px; line-height: 1.5;">
              This link expires in 30 minutes. If you didn't request this, you can safely ignore this email —
              your password won't be changed.
            </p>
          </div>
        `,
      }).catch((err) => {
        console.error("[forgot-password] failed to send email:", err);
      });
    } else {
      // No ZEPTOMAIL_API_TOKEN configured yet — log the link so the flow is
      // still usable (locally, or in prod before the token is wired up)
      // instead of silently doing nothing.
      console.warn(`[forgot-password] ZEPTOMAIL_API_TOKEN not set — reset link for ${user.email}: ${resetUrl}`);
    }
  }

  return NextResponse.json({ ok: true });
}
