"use client";

import { Fragment, useState } from "react";
import { ChevronDown, MessageSquareText, Sparkles } from "lucide-react";
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
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  LEADS_QUERY,
  UPDATE_LEAD_STATUS_MUTATION,
  type Lead,
  type LeadsResult,
  type LeadsVars,
  type LeadStatus,
  type UpdateLeadStatusResult,
  type UpdateLeadStatusVars,
} from "@/lib/graphql/leads";

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-primary/40 text-primary",
  REVIEWED: "border-border text-foreground",
  CONTACTED: "border-border text-muted-foreground",
  ARCHIVED: "border-border text-muted-foreground/60",
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
  const { data, loading } = useQuery<LeadsResult, LeadsVars>(LEADS_QUERY, {
    variables: { status: statusFilter },
  });
  const [updateLeadStatus] = useMutation<
    UpdateLeadStatusResult,
    UpdateLeadStatusVars
  >(UPDATE_LEAD_STATUS_MUTATION);

  const leads = (data?.leads ?? []).filter((lead) => matchesSearch(lead, search));

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading leads…
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No leads yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Lead</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-4 text-right">Time</TableHead>
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
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 text-muted-foreground transition-transform",
                          expanded && "rotate-180"
                        )}
                      />
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
                  <TableCell className="text-muted-foreground">
                    {lead.company ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.source ?? "—"}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {lead.score}
                  </TableCell>
                  <TableCell>
                    <TierBadge tier={lead.tier} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusStyles[lead.status]}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right text-muted-foreground">
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
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Agent reasoning
                            </p>
                            <p className="text-sm leading-relaxed text-foreground">
                              {lead.reasoning}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <MessageSquareText className="size-3.5 text-muted-foreground" />
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Draft reply
                            </p>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">
                            {lead.draftReply}
                          </p>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              disabled={lead.status === "CONTACTED"}
                              onClick={() =>
                                updateLeadStatus({
                                  variables: { id: lead.id, status: "CONTACTED" },
                                })
                              }
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              Send
                            </Button>
                          </div>
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
