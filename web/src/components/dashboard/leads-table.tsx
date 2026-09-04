"use client";

import { Fragment, useState } from "react";
import { ChevronDown, MessageSquareText, Sparkles } from "lucide-react";
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
import { cn } from "@/lib/utils";

type LeadStatus = "NEW" | "REVIEWED" | "CONTACTED" | "ARCHIVED";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  score: number;
  tier: "HOT" | "WARM" | "COLD";
  status: LeadStatus;
  time: string;
  reasoning: string;
  draftReply: string;
};

const leads: Lead[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@acme.io",
    company: "Acme Corp",
    source: "Inbound Form",
    score: 92,
    tier: "HOT",
    status: "REVIEWED",
    time: "2m ago",
    reasoning:
      "VP Sales at a 150 person FinTech company. Stated budget of $50k+, uses Salesforce. Matches the ICP on company size, industry, and expressed clear intent to buy within 48 hours.",
    draftReply:
      "Hi Sarah, thanks for reaching out about lead qualification. With a 25 person sales team, our Growth plan would be a great fit. Want me to send over a tailored proposal?",
  },
  {
    id: "2",
    name: "James Doe",
    email: "j.doe@northwind.com",
    company: "Northwind",
    source: "Webhook",
    score: 76,
    tier: "WARM",
    status: "NEW",
    time: "14m ago",
    reasoning:
      "Came through the HubSpot integration already in a qualified deal stage. Company size and budget signals are positive, but intent signals are moderate since no direct demo request yet.",
    draftReply:
      "Hi James, I see Northwind came through your HubSpot integration. Your team is already in our qualified pipeline, so I've drafted a follow up based on your last conversation with Alex.",
  },
  {
    id: "3",
    name: "Elena Voss",
    email: "elena@pinnaclesaas.com",
    company: "Pinnacle SaaS",
    source: "Partner Referral",
    score: 86,
    tier: "HOT",
    status: "CONTACTED",
    time: "1h ago",
    reasoning:
      "Referred by a Gold tier partner. VP Operations title, 80 employee SaaS company, strong industry fit. Partner referrals historically convert 3x higher than cold inbound.",
    draftReply:
      "Hi Elena, Globex Partners recommended we connect. Welcome to Sift! As a Gold partner referral, you'll get priority onboarding and a dedicated success manager from day one.",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@relayhq.com",
    company: "RelayHQ",
    source: "Event Signup",
    score: 78,
    tier: "WARM",
    status: "NEW",
    time: "3h ago",
    reasoning:
      "Met at SaaStr Annual. VP Sales at a Series B company that recently raised $18M. Lead scoring was mentioned as a stated priority, matching a core use case.",
    draftReply:
      "Hi David, great meeting you at SaaStr! You mentioned lead scoring was a priority for RelayHQ post Series B. I've put together a quick overview of how Sift handles qualification at your scale.",
  },
  {
    id: "5",
    name: "Marcus Webb",
    email: "marcus@initech.com",
    company: "Initech",
    source: "Demo Request",
    score: 94,
    tier: "HOT",
    status: "REVIEWED",
    time: "5h ago",
    reasoning:
      "CTO at a 320 employee company, booked a demo directly. Currently using spreadsheets for lead routing, a clear pain point Sift solves. Highest intent signal in the queue.",
    draftReply:
      "Hi Marcus, looking forward to your demo tomorrow at 2pm. I've prepared a walkthrough focused on lead routing for your 320 person team. Shall I include your RevOps lead on the invite?",
  },
  {
    id: "6",
    name: "Priya Patel",
    email: "priya@brightwave.io",
    company: "Brightwave",
    source: "Pricing Inquiry",
    score: 82,
    tier: "WARM",
    status: "ARCHIVED",
    time: "1d ago",
    reasoning:
      "18 rep team evaluating pricing tiers at roughly 2,400 leads per month. Best fit is the Growth plan. Archived after initial reply went unanswered for a week.",
    draftReply:
      "Hi Priya, based on your ~2,400 monthly leads and 18 person team, Growth at $149/mo is the best fit. I've attached a breakdown showing projected time saved per rep.",
  },
];

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-primary/40 text-primary",
  REVIEWED: "border-border text-foreground",
  CONTACTED: "border-border text-muted-foreground",
  ARCHIVED: "border-border text-muted-foreground/60",
};

export function LeadsTable() {
  const [expandedId, setExpandedId] = useState<string | null>(leads[0].id);

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
                    {lead.company}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.source}
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
                    {lead.time}
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
