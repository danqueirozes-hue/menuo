import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserRestaurants } from "@/lib/session";
import { getDashboardContent } from "@/lib/dashboard-content";
import { ContactDock } from "@/components/dashboard/ContactDock";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // The dock sits above every establishment, so it follows the account's
  // first menu language (same rule as the rest of the dashboard).
  const [first] = await getUserRestaurants(session.user.id);
  const dict = getDashboardContent(first?.menus[0]?.defaultLanguage).contact;

  return (
    <div className="min-h-screen bg-paper">
      {children}
      <ContactDock dict={dict} />
    </div>
  );
}
