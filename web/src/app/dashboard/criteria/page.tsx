"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  UPDATE_WORKSPACE_MUTATION,
  WORKSPACE_QUERY,
  type UpdateWorkspaceResult,
  type UpdateWorkspaceVars,
  type WorkspaceResult,
} from "@/lib/graphql/workspace";

export default function CriteriaPage() {
  const { data, loading: queryLoading } = useQuery<WorkspaceResult>(
    WORKSPACE_QUERY
  );
  const [criteria, setCriteria] = useState("");
  const [dirty, setDirty] = useState(false);
  const [updateWorkspace, { loading: saving }] = useMutation<
    UpdateWorkspaceResult,
    UpdateWorkspaceVars
  >(UPDATE_WORKSPACE_MUTATION);

  useEffect(() => {
    if (data?.workspace) {
      setCriteria(data.workspace.qualificationCriteria);
    }
  }, [data?.workspace]);

  const handleSave = async () => {
    await updateWorkspace({
      variables: { input: { qualificationCriteria: criteria } },
    });
    setDirty(false);
  };

  return (
    <>
      <DashboardTopbar
        title="Qualification Criteria"
        description="Tell the agent what a good lead looks like for your team"
      />
      <main className="flex-1 p-6">
        <Card className="max-w-2xl border-border">
          <CardHeader>
            <CardTitle>Criteria</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="criteria">
                Describe your ideal customer in plain language
              </Label>
              <Textarea
                id="criteria"
                rows={12}
                value={criteria}
                disabled={queryLoading}
                onChange={(e) => {
                  setCriteria(e.target.value);
                  setDirty(true);
                }}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                The agent reasons over this text for every incoming lead, it
                is not a fixed rule engine.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={saving || queryLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? "Saving…" : "Save criteria"}
              </Button>
              {!dirty && !saving && data && (
                <span className="text-xs text-muted-foreground">Saved</span>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
