"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ME_QUERY, type MeResult } from "@/lib/graphql/auth";
import {
  UPDATE_WORKSPACE_MUTATION,
  WORKSPACE_QUERY,
  type UpdateWorkspaceResult,
  type UpdateWorkspaceVars,
  type WorkspaceResult,
} from "@/lib/graphql/workspace";

export default function SettingsPage() {
  const { data: meData } = useQuery<MeResult>(ME_QUERY);
  const { data: workspaceData, loading: queryLoading } =
    useQuery<WorkspaceResult>(WORKSPACE_QUERY);
  const [name, setName] = useState("");
  const [updateWorkspace, { loading: saving }] = useMutation<
    UpdateWorkspaceResult,
    UpdateWorkspaceVars
  >(UPDATE_WORKSPACE_MUTATION);

  useEffect(() => {
    if (workspaceData?.workspace) {
      setName(workspaceData.workspace.name);
    }
  }, [workspaceData?.workspace]);

  const handleSave = () => {
    updateWorkspace({ variables: { input: { name } } });
  };

  return (
    <>
      <DashboardTopbar
        title="Settings"
        description="Manage your workspace and account"
      />
      <main className="flex-1 p-6">
        <Card className="max-w-2xl border-border">
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="workspace">Workspace name</Label>
              <Input
                id="workspace"
                value={name}
                disabled={queryLoading}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Label htmlFor="ownerEmail">Owner email</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={meData?.me.email ?? ""}
                disabled
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <Button
                onClick={handleSave}
                disabled={saving || queryLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
