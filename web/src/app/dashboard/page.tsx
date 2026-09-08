"use client";

import { useQuery } from "@apollo/client/react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { LEADS_QUERY, type LeadsResult, type LeadsVars } from "@/lib/graphql/leads";

export default function DashboardPage() {
  const { data } = useQuery<LeadsResult, LeadsVars>(LEADS_QUERY, {
    variables: { status: "NEW" },
  });
  const newCount = data?.leads.length ?? 0;

  return (
    <>
      <DashboardTopbar
        title="Inbox"
        description={`${newCount} lead${newCount === 1 ? "" : "s"} waiting to be reviewed`}
      />
      <main className="flex-1 p-6">
        <LeadsTable statusFilter="NEW" />
      </main>
    </>
  );
}
