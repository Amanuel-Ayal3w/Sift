"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const defaultCriteria = `Qualify as HOT if the lead:
- Works at a company with 50-500 employees
- Has a stated budget of $25k+ per year
- Is in SaaS, FinTech, or B2B services
- Requested a demo or mentioned a specific timeline

Qualify as WARM if the lead matches 2-3 of the above.
Qualify as COLD if the lead is a student, competitor, or has no budget signal.`;

export default function CriteriaPage() {
  const [criteria, setCriteria] = useState(defaultCriteria);
  const [saved, setSaved] = useState(true);

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
                onChange={(e) => {
                  setCriteria(e.target.value);
                  setSaved(false);
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
                onClick={() => setSaved(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save criteria
              </Button>
              {saved && (
                <span className="text-xs text-muted-foreground">Saved</span>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
