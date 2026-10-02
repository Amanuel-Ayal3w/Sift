import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { LeadLiveUpdates } from "@/components/dashboard/lead-live-updates";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <LeadLiveUpdates />
      <DashboardSidebar workspaceName={session.workspaceName} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
