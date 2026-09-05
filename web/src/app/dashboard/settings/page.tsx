import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
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
                defaultValue="Acme Workspace"
                className="h-11 rounded-xl"
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Label htmlFor="ownerEmail">Owner email</Label>
              <Input
                id="ownerEmail"
                type="email"
                defaultValue="jane@acme.io"
                disabled
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
