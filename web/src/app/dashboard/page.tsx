"use client";

import { useQuery } from "@apollo/client/react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { OverviewMetrics } from "@/components/dashboard/overview-metrics";
import { LEADS_QUERY, type LeadsResult, type LeadsVars } from "@/lib/graphql/leads";

export default function DashboardPage() {
  const { data } = useQuery<LeadsResult, LeadsVars>(LEADS_QUERY);

  return (
    <>
      <DashboardTopbar
        title="Overview"
        description="A snapshot of your pipeline, right now."
      />
      <main className="flex-1 space-y-6 px-8 pb-10 pt-4">
        <OverviewMetrics leads={data?.leads ?? []} />
        <LeadsTable statusFilter="NEW" />
      </main>
    </>
  );
}
