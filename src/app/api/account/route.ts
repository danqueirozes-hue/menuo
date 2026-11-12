import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const schema = z.object({ email: z.string() });

/** Self-service account deletion: cancels any Stripe subscription right
 * away (no further charges), then deletes the account and everything under
 * it (restaurants → menus → sections → dishes cascade). The caller must
 * retype the account email as confirmation. */
export async function DELETE(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!parsed.success || parsed.data.email.trim().toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json({ error: "Email does not match" }, { status: 400 });
  }
  // Admin accounts are deleted by hand, never from the UI — avoids locking
  // the owner out of /admin by accident.
  if (user.isAdmin) return NextResponse.json({ error: "Admin accounts can't be deleted here" }, { status: 403 });

  const sub = user.subscription;
  const stripe = getStripe();
  if (stripe && sub?.stripeSubscriptionId && sub.status !== "canceled") {
    try {
      await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
    } catch (err) {
      // Already canceled/deleted on Stripe's side is fine; anything else
      // must stop the deletion so we never orphan a live, billing subscription.
      const code = (err as { code?: string }).code;
      if (code !== "resource_missing") {
        console.error("[account delete] could not cancel Stripe subscription:", err);
        return NextResponse.json({ error: "Could not cancel the subscription" }, { status: 502 });
      }
    }
  }

  await prisma.$transaction([
    prisma.subscription.deleteMany({ where: { userId } }),
    prisma.restaurant.deleteMany({ where: { ownerId: userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return NextResponse.json({ deleted: true });
}
