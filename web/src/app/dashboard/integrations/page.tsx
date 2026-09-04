"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const webhookUrl = "https://api.sift.app/webhook/acme-workspace";

const channels = [
  { name: "Inbound Form", status: "Connected" },
  { name: "Webhook", status: "Connected" },
  { name: "Chat Handoff", status: "Available" },
  { name: "CRM Sync (HubSpot)", status: "Available" },
  { name: "Slack Notifications", status: "Available" },
];

export default function IntegrationsPage() {
  const [copied, setCopied] = useState(false);

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <DashboardTopbar
        title="Integrations"
        description="Connect the channels your leads come from"
      />
      <main className="flex-1 space-y-6 p-6">
        <Card className="max-w-2xl border-border">
          <CardHeader>
            <CardTitle>Your webhook URL</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Point any form, CRM, or automation tool at this endpoint. New
              leads are qualified within seconds of arriving.
            </p>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={webhookUrl}
                className="h-10 flex-1 font-mono text-xs"
              />
              <button
                type="button"
                onClick={copyWebhook}
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                {copied ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl border-border">
          <CardHeader>
            <CardTitle>Channels</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {channels.map((channel) => (
              <div
                key={channel.name}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="text-sm font-medium text-foreground">
                  {channel.name}
                </span>
                <Badge
                  variant="outline"
                  className={
                    channel.status === "Connected"
                      ? "border-primary/40 text-primary"
                      : "text-muted-foreground"
                  }
                >
                  {channel.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
