import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSubscription, getEffectiveLimits, getUserRestaurants } from "@/lib/session";
import { Logo } from "@/components/ui/Logo";
import { NewEstablishmentForm } from "@/components/dashboard/NewEstablishmentForm";

export default async function NewEstablishmentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [subscription, restaurants] = await Promise.all([
    getSubscription(session.user.id),
    getUserRestaurants(session.user.id),
  ]);
  const limits = getEffectiveLimits(subscription);

  if (restaurants.length >= limits.maxEstablishments) {
    redirect("/dashboard/billing");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Link href="/dashboard">
        <Logo className="h-7" />
      </Link>
      <h1 className="font-display mt-8 text-2xl text-ink">New establishment</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Each establishment gets its own menus, branding and QR codes.
      </p>
      <div className="mt-8">
        <NewEstablishmentForm />
      </div>
    </div>
  );
}
