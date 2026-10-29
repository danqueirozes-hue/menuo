import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CheckoutConversion } from "@/components/dashboard/CheckoutConversion";
import { getBillingContent } from "@/lib/billing-content";
import { getRequestLocale } from "@/lib/request-locale";

// Stripe Checkout's success_url. Only reachable by completing checkout (card
// added / trial started), so Google Ads can count a conversion on this URL.
// Auth is enforced by the dashboard layout.
export default async function BillingConfirmedPage() {
  const { confirmed } = getBillingContent(await getRequestLocale());

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <Link href="/dashboard">
        <Logo className="h-7" />
      </Link>

      <div className="mt-16 rounded-xl border border-border bg-panel p-8 text-center">
        <CircleCheck size={44} className="mx-auto text-green" />
        <h1 className="font-display mt-5 text-3xl text-ink">{confirmed.title}</h1>
        <p className="mt-3 text-ink-soft">{confirmed.body}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-amber px-5 py-3 text-sm font-medium text-navy hover:bg-amber-soft"
          >
            {confirmed.primary}
          </Link>
          <Link href="/dashboard/billing" className="text-sm text-ink-soft hover:text-amber">
            {confirmed.secondary}
          </Link>
        </div>
      </div>

      <CheckoutConversion />
    </div>
  );
}
