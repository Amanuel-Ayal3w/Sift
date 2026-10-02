"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CONNECT_GMAIL_MUTATION,
  INTEGRATIONS_QUERY,
  type ConnectGmailResult,
  type ConnectGmailVars,
  type IntegrationsResult,
} from "@/lib/graphql/integrations";

export default function IntegrationsPage() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  const { data } = useQuery<IntegrationsResult>(INTEGRATIONS_QUERY);
  const [connectGmail, { loading: connecting }] = useMutation<
    ConnectGmailResult,
    ConnectGmailVars
  >(CONNECT_GMAIL_MUTATION, {
    refetchQueries: [{ query: INTEGRATIONS_QUERY }],
  });
  const webhookUrl = data?.integrations.webhookUrl ?? "";
  const channels = data?.integrations.channels ?? [];
  const connected = data?.integrations.inboxConnected ?? false;

  useEffect(() => {
    const mailbox = data?.integrations.mailboxAddress;
    if (mailbox) setEmail((current) => current || mailbox);
  }, [data?.integrations.mailboxAddress]);

  const saveGmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    setSaved(false);
    try {
      await connectGmail({ variables: { input: { email, appPassword } } });
      setAppPassword("");
      setSaved(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not connect Gmail.");
    }
  };

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
      <main className="flex-1 space-y-6 px-8 pb-10 pt-4">
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
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>Gmail</CardTitle>
            <Badge
              className={
                connected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }
            >
              {connected ? "Connected" : "Not connected"}
            </Badge>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveGmail} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {connected
                  ? "Unread mail to this address becomes a lead. After scoring, the reply is emailed back to the sender."
                  : "Enter the Gmail account that should receive leads and send replies."}
              </p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="gmail-address">Gmail address</Label>
                <Input
                  id="gmail-address"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="gmail-app-password">App password</Label>
                <Input
                  id="gmail-app-password"
                  type="password"
                  required
                  autoComplete="off"
                  placeholder={connected ? "Saved — enter a new one to replace it" : "16-character app password"}
                  value={appPassword}
                  onChange={(event) => setAppPassword(event.target.value)}
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  Google Account, then Security, then App passwords. This is not your normal Gmail password.
                </p>
              </div>
              {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
              {saved ? <p className="text-sm text-primary">Gmail connected.</p> : null}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={connecting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {connecting ? "Connecting…" : "Connect Gmail"}
                </Button>
              </div>
            </form>
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
                  className={
                    channel.status === "Connected"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
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
