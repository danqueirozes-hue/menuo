import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PLAN_ORDER } from "@/lib/plans";

const schema = z.object({
  plan: z.enum(PLAN_ORDER as [string, ...string[]]),
  interval: z.enum(["monthly", "annual"]),
  status: z.enum(["active", "trialing", "past_due", "canceled", "incomplete"]),
});

// Admin override: sets the plan/interval/status directly on our own
// Subscription record. This does NOT touch Stripe — it's for comping an
// account, fixing a support issue, or testing, not for billing a real
// customer. If the account has a live Stripe subscription, changing things
// here does not cancel or modify that Stripe subscription.
export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const adminUserId = await requireAdminUserId();
  if (!adminUserId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { userId } = await params;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { plan, interval, status } = parsed.data;

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    create: { userId, plan, interval, status },
    update: { plan, interval, status },
  });

  return NextResponse.json(subscription);
}
