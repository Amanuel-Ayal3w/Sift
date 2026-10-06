"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { WorkspaceTable } from "@/components/admin/workspace-table";
import { Input } from "@/components/ui/input";
import {
  PLATFORM_WORKSPACES_QUERY,
  type PlatformWorkspacesResult,
} from "@/lib/graphql/platform";

export default function AdminWorkspacesPage() {
  const { data, loading } = useQuery<PlatformWorkspacesResult>(
    PLATFORM_WORKSPACES_QUERY,
  );
  const [search, setSearch] = useState("");
  const workspaces = data?.platformWorkspaces ?? [];
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return workspaces;
    return workspaces.filter(
      (workspace) =>
        workspace.name.toLowerCase().includes(needle) ||
        (workspace.ownerEmail?.toLowerCase().includes(needle) ?? false),
    );
  }, [search, workspaces]);

  return (
    <>
      <AdminTopbar
        title="Workspaces"
        description="Suspend a workspace to stop logins, new leads, and scoring. Existing data stays put."
      />
      <main className="flex-1 space-y-4 px-8 pb-10 pt-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by workspace or owner"
          className="h-11 max-w-sm rounded-xl"
        />
        <WorkspaceTable
          workspaces={filtered}
          loading={loading}
          emptyLabel={
            search.trim() ? "No matching workspaces." : "No workspaces yet."
          }
        />
      </main>
    </>
  );
}
