import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ContactDock } from "@/components/dashboard/ContactDock";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-paper">
      {children}
      <ContactDock />
    </div>
  );
}
