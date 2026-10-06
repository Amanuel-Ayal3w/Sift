"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { AdminMetrics } from "@/components/admin/admin-metrics";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { UserTable } from "@/components/admin/user-table";
import { WorkspaceTable } from "@/components/admin/workspace-table";
import {
  PLATFORM_METRICS_QUERY,
  PLATFORM_OVERVIEW_QUERY,
  PLATFORM_USERS_QUERY,
  PLATFORM_WORKSPACES_QUERY,
  type PlatformMetricsResult,
  type PlatformOverviewResult,
  type PlatformUsersResult,
  type PlatformWorkspacesResult,
} from "@/lib/graphql/platform";

export default function AdminOverviewPage() {
  const overview = useQuery<PlatformOverviewResult>(PLATFORM_OVERVIEW_QUERY);
  const metrics = useQuery<PlatformMetricsResult>(PLATFORM_METRICS_QUERY);
  const workspaces = useQuery<PlatformWorkspacesResult>(PLATFORM_WORKSPACES_QUERY);
  const users = useQuery<PlatformUsersResult>(PLATFORM_USERS_QUERY);

  return (
    <>
      <AdminTopbar
        title="Overview"
        description="Revenue, pipeline, and signup activity across every workspace."
      />
      <main className="flex-1 space-y-8 px-8 pb-10 pt-4">
        <AdminMetrics
          overview={overview.data?.platformOverview}
          metrics={metrics.data?.platformMetrics}
        />

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium">Recent workspaces</h2>
            <Link
              href="/admin/workspaces"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <WorkspaceTable
            workspaces={workspaces.data?.platformWorkspaces ?? []}
            loading={workspaces.loading}
            limit={5}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium">Recent users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <UserTable
            users={users.data?.platformUsers ?? []}
            loading={users.loading}
            limit={5}
          />
        </section>
      </main>
    </>
  );
}
