"use client";

import { Fragment, useState } from "react";
import { ChevronDown, Mail, MessageSquareText, Sparkles } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TierBadge } from "@/components/dashboard/tier-badge";
import { cn, formatRelativeTime, initials, avatarTone } from "@/lib/utils";
import {
  INTEGRATIONS_QUERY,
  type IntegrationsResult,
} from "@/lib/graphql/integrations";
import {
  LEADS_QUERY,
  SEND_LEAD_REPLY_MUTATION,
  type Lead,
  type LeadsResult,
  type LeadsVars,
  type LeadStatus,
  type SendLeadReplyResult,
  type SendLeadReplyVars,
} from "@/lib/graphql/leads";

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-transparent bg-primary text-primary-foreground",
  REVIEWED: "border-transparent bg-muted text-foreground",
  CONTACTED: "border-transparent bg-muted text-muted-foreground",
  ARCHIVED: "border-transparent bg-muted text-muted-foreground/70",
};

function matchesSearch(lead: Lead, search: string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;
  return (
    lead.name.toLowerCase().includes(needle) ||
    lead.email.toLowerCase().includes(needle) ||
    (lead.company?.toLowerCase().includes(needle) ?? false)
  );
}

export function LeadsTable({
  statusFilter,
  search = "",
}: {
  statusFilter?: LeadStatus;
  search?: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<{ id: string; message: string } | null>(null);
  const { data, loading } = useQuery<LeadsResult, LeadsVars>(LEADS_QUERY, {
    variables: { status: statusFilter },
  });
  const { data: integrations } = useQuery<IntegrationsResult>(INTEGRATIONS_QUERY);
  const repliesEnabled = integrations?.integrations.repliesEnabled ?? false;
  const [sendLeadReply] = useMutation<SendLeadReplyResult, SendLeadReplyVars>(
    SEND_LEAD_REPLY_MUTATION,
  );

  const emailReply = async (leadId: string) => {
    setSendingId(leadId);
    setSendError(null);
    try {
      await sendLeadReply({
        variables: { id: leadId },
        refetchQueries: [{ query: LEADS_QUERY, variables: { status: statusFilter } }],
      });
    } catch (err) {
      setSendError({
        id: leadId,
        message: err instanceof Error ? err.message : "Could not send this reply.",
      });
    } finally {
      setSendingId(null);
    }
  };

  const leads = (data?.leads ?? []).filter((lead) => matchesSearch(lead, search));

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground glass">
        Loading leads…
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground glass">
        No leads yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card glass">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 pl-5 font-mono text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Lead
            </TableHead>
            <TableHead className="h-11 font-mono text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Company
            </TableHead>
            <TableHead className="h-11 font-mono text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Source
            </TableHead>
            <TableHead className="h-11 font-mono text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Score
            </TableHead>
            <TableHead className="h-11 font-mono text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Tier
            </TableHead>
            <TableHead className="h-11 font-mono text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Status
            </TableHead>
            <TableHead className="h-11 pr-5 text-right font-mono text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Time
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const expanded = expandedId === lead.id;
            return (
              <Fragment key={lead.id}>
                <TableRow
                  onClick={() =>
                    setExpandedId(expanded ? null : lead.id)
                  }
                  aria-expanded={expanded}
                  className="cursor-pointer"
                >
                  <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 text-muted-foreground transition-transform",
                          expanded && "rotate-180"
                        )}
                      />
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                          avatarTone(lead.email)
                        )}
                      >
                        {initials(lead.name) || "?"}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {lead.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-muted-foreground">
                    {lead.company ?? "—"}
                  </TableCell>
                  <TableCell className="py-3.5 text-muted-foreground">
                    {lead.source ?? "—"}
                  </TableCell>
                  <TableCell className="py-3.5 text-lg font-medium tracking-tight text-foreground">
                    {lead.score ?? "—"}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {lead.tier ? <TierBadge tier={lead.tier} /> : "—"}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Badge className={statusStyles[lead.status]}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-right text-xs text-muted-foreground">
                    {formatRelativeTime(lead.createdAt)}
                  </TableCell>
                </TableRow>
                {expanded && (
                  <TableRow
                    key={`${lead.id}-detail`}
                    className="hover:bg-transparent"
                  >
                    <TableCell
                      colSpan={7}
                      className="whitespace-normal bg-muted/40 p-0"
                    >
                      <div className="max-w-2xl space-y-5 p-5">
                        <div className="flex gap-3">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
                            <Sparkles className="size-3.5 text-primary" />
                          </span>
                          <div>
                            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Agent reasoning
                            </p>
                            <p className="text-sm leading-relaxed text-foreground">
                              {lead.reasoning ?? "Qualification in progress…"}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex gap-3">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Mail className="size-3.5 text-muted-foreground" />
                          </span>
                          <div>
                            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {lead.source === "Email" ? "Email they sent" : "Their message"}
                            </p>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                              {lead.message}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <MessageSquareText className="size-3.5 text-muted-foreground" />
                            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {lead.status === "CONTACTED" ? "Emailed reply" : "Draft reply"}
                            </p>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {lead.draftReply ?? "A reply will appear once the lead is scored."}
                          </p>
                          {lead.status === "CONTACTED" ? (
                            <p className="mt-3 text-xs text-muted-foreground">
                              Sent to {lead.email}
                            </p>
                          ) : (
                            <div className="mt-4 flex items-center justify-end gap-3">
                              {sendError?.id === lead.id ? (
                                <p className="text-xs text-destructive">{sendError.message}</p>
                              ) : null}
                              {!repliesEnabled ? (
                                <p className="text-xs text-muted-foreground">
                                  Connect Gmail under Integrations to email this reply.
                                </p>
                              ) : null}
                              <Button
                                size="sm"
                                disabled={
                                  !repliesEnabled ||
                                  !lead.draftReply ||
                                  sendingId === lead.id
                                }
                                onClick={() => emailReply(lead.id)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                {sendingId === lead.id ? "Sending…" : "Send email"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
