import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { LeadsTable } from "@/components/dashboard/leads-table";

export default function DashboardPage() {
  return (
    <>
      <DashboardTopbar
        title="Inbox"
        description="12 leads waiting to be reviewed"
      />
      <main className="flex-1 p-6">
        <LeadsTable />
      </main>
    </>
  );
}
