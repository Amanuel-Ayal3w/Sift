"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PLATFORM_METRICS_QUERY,
  PLATFORM_OVERVIEW_QUERY,
  PLATFORM_WORKSPACES_QUERY,
  SET_WORKSPACE_PLAN_MUTATION,
  SET_WORKSPACE_SUSPENDED_MUTATION,
  type BillingPlan,
  type PlatformWorkspace,
  type SetWorkspacePlanResult,
  type SetWorkspacePlanVars,
  type SetWorkspaceSuspendedResult,
  type SetWorkspaceSuspendedVars,
} from "@/lib/graphql/platform";
import { formatRelativeTime } from "@/lib/utils";

export function WorkspaceTable({
  workspaces,
  limit,
  loading = false,
  emptyLabel = "No workspaces yet.",
}: {
  workspaces: PlatformWorkspace[];
  limit?: number;
  loading?: boolean;
  emptyLabel?: string;
}) {
  const rows = limit ? workspaces.slice(0, limit) : workspaces;
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [setSuspended] = useMutation<
    SetWorkspaceSuspendedResult,
    SetWorkspaceSuspendedVars
  >(SET_WORKSPACE_SUSPENDED_MUTATION, {
    refetchQueries: [
      { query: PLATFORM_WORKSPACES_QUERY },
      { query: PLATFORM_OVERVIEW_QUERY },
      { query: PLATFORM_METRICS_QUERY },
    ],
  });
  const [setPlan] = useMutation<SetWorkspacePlanResult, SetWorkspacePlanVars>(
    SET_WORKSPACE_PLAN_MUTATION,
    {
      refetchQueries: [
        { query: PLATFORM_WORKSPACES_QUERY },
        { query: PLATFORM_METRICS_QUERY },
      ],
    },
  );

  const toggle = async (workspace: PlatformWorkspace) => {
    const next = !workspace.suspended;
    if (
      next &&
      !window.confirm(
        `Suspend ${workspace.name}? People in this workspace will be signed out, and new leads will stop coming in.`,
      )
    ) {
      return;
    }
    setPendingId(workspace.id);
    setError(null);
    try {
      await setSuspended({
        variables: { id: workspace.id, suspended: next },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update workspace");
    } finally {
      setPendingId(null);
    }
  };

  const changePlan = async (workspace: PlatformWorkspace, plan: BillingPlan) => {
    if (plan === workspace.plan) return;
    setPendingId(workspace.id);
    setError(null);
    try {
      await setPlan({ variables: { id: workspace.id, plan } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update plan");
    } finally {
      setPendingId(null);
    }
  };

  if (loading && rows.length === 0) {
    return <p className="px-2 py-8 text-sm text-muted-foreground">Loading workspaces…</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="px-2 py-8 text-sm text-muted-foreground">{emptyLabel}</p>
    );
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workspace</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Leads</TableHead>
            <TableHead>Mailbox</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((workspace) => (
            <TableRow key={workspace.id}>
              <TableCell className="font-medium">{workspace.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {workspace.ownerEmail ?? "—"}
              </TableCell>
              <TableCell>{workspace.userCount}</TableCell>
              <TableCell>{workspace.leadCount}</TableCell>
              <TableCell className="text-muted-foreground">
                {workspace.gmailConnected ? "Connected" : "Off"}
              </TableCell>
              <TableCell>
                <select
                  aria-label={`Plan for ${workspace.name}`}
                  value={workspace.plan}
                  disabled={pendingId === workspace.id}
                  onChange={(event) =>
                    changePlan(workspace, event.target.value as BillingPlan)
                  }
                  className="h-8 rounded-lg border border-border bg-background px-2 text-xs"
                >
                  <option value="TRIAL">Trial · $0</option>
                  <option value="STARTER">Starter · $49</option>
                  <option value="GROWTH">Growth · $149</option>
                </select>
              </TableCell>
              <TableCell>
                <Badge variant={workspace.suspended ? "destructive" : "secondary"}>
                  {workspace.suspended ? "Suspended" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatRelativeTime(workspace.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant={workspace.suspended ? "outline" : "destructive"}
                  disabled={pendingId === workspace.id}
                  onClick={() => toggle(workspace)}
                >
                  {workspace.suspended ? "Restore" : "Suspend"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
