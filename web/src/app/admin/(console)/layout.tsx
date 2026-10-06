import { redirect } from "next/navigation";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-sidebar";
import { getPlatformSession } from "@/lib/platform-session";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getPlatformSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar email={session.email} />
      <div className="flex flex-1 flex-col">
        <AdminMobileNav />
        {children}
      </div>
    </div>
  );
}
