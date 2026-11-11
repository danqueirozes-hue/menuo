import { isSubscriptionActive } from "@/lib/session";

/** Accounts created from this moment on must pick a plan and add a card
 * (Stripe Checkout, 14-day free trial for first-time customers) before they
 * can use the dashboard. Earlier signups keep the old "build first, pay to
 * publish" flow they were promised. */
export const CARD_REQUIRED_SINCE = new Date("2026-11-11T14:00:00Z");

export function isCardRequiredAccount(user: { createdAt: Date; isAdmin: boolean }): boolean {
  return !user.isAdmin && user.createdAt >= CARD_REQUIRED_SINCE;
}

/** True when this account has to go through checkout before using the dashboard. */
export function mustChoosePlan(
  user: { createdAt: Date; isAdmin: boolean },
  subscription: { status: string } | null
): boolean {
  return isCardRequiredAccount(user) && !isSubscriptionActive(subscription);
}
