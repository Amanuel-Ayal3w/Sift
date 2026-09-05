import { cn } from "@/lib/utils";

export function TierBadge({
  tier,
  className,
}: {
  tier: "HOT" | "WARM" | "COLD";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold",
        tier === "HOT" && "bg-primary text-black",
        tier === "WARM" && "bg-[#e8b44f] text-black",
        tier === "COLD" && "bg-muted text-muted-foreground",
        className
      )}
    >
      {tier}
    </span>
  );
}

export function ScoreRing({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-foreground">{score}</span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

type Lead = {
  name: string;
  company: string;
  source: string;
  score: number;
  tier: "HOT" | "WARM" | "COLD";
  time: string;
  active?: boolean;
};

const inboxLeads: Lead[] = [
  {
    name: "Sarah Chen",
    company: "Acme Corp",
    source: "Inbound Form",
    score: 92,
    tier: "HOT",
    time: "2m ago",
    active: true,
  },
  {
    name: "James Doe",
    company: "Northwind",
    source: "Webhook",
    score: 76,
    tier: "WARM",
    time: "14m ago",
  },
  {
    name: "Elena Voss",
    company: "Pinnacle SaaS",
    source: "Partner Referral",
    score: 86,
    tier: "HOT",
    time: "1h ago",
  },
  {
    name: "David Kim",
    company: "RelayHQ",
    source: "Event Signup",
    score: 78,
    tier: "WARM",
    time: "3h ago",
  },
];

const navItems = [
  { label: "Inbox", active: true, count: 12 },
  { label: "Leads", active: false },
  { label: "Criteria", active: false },
  { label: "Integrations", active: false },
  { label: "Settings", active: false },
];

export function DashboardPreview({ compact = false }: { compact?: boolean }) {
  const activeLead = inboxLeads.find((l) => l.active) ?? inboxLeads[0];

  return (
    <div
      className={cn(
        "mx-auto overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
        compact ? "min-w-[460px] text-[10px]" : "w-[720px] max-w-full text-xs"
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-black/20" />
          <div className="size-2.5 rounded-full bg-black/20" />
          <div className="size-2.5 rounded-full bg-black/20" />
        </div>
        <span className="mx-auto text-[11px] font-semibold text-black">
          Sift, Lead Inbox
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={cn(
            "shrink-0 border-r border-border bg-muted/60 py-3",
            compact ? "w-[100px] sm:w-[140px]" : "w-[140px]"
          )}
        >
          <div className={cn("mb-4 px-3", compact && "hidden sm:block")}>
            <p className="text-[10px] font-bold text-foreground">Sift</p>
            <p className="text-[9px] text-muted-foreground">
              Acme Workspace
            </p>
          </div>
          <nav className="flex flex-col gap-0.5 px-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2 py-1.5 sm:px-3",
                  item.active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    compact ? "hidden sm:inline" : "inline"
                  )}
                >
                  {item.label}
                </span>
                {compact && (
                  <span className="font-medium sm:hidden">
                    {item.label.slice(0, 1)}
                  </span>
                )}
                {item.count && (
                  <span className="rounded-full bg-primary px-1.5 text-[9px] font-bold text-black">
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Lead list */}
        <div
          className={cn(
            "shrink-0 border-r border-border bg-card",
            compact ? "w-[150px] sm:w-[200px]" : "w-[200px]"
          )}
        >
          <div className="border-b border-border px-3 py-2">
            <p className="font-semibold text-foreground">Inbox</p>
            <p className="text-[9px] text-muted-foreground">
              12 unqualified today
            </p>
          </div>
          {inboxLeads.map((lead) => (
            <div
              key={lead.name}
              className={cn(
                "border-b border-border/60 px-3 py-2.5",
                lead.active && "bg-accent"
              )}
            >
              <div className="flex items-start justify-between gap-1">
                <p className="truncate font-medium text-foreground">
                  {lead.name}
                </p>
                <TierBadge tier={lead.tier} />
              </div>
              <p className="truncate text-[9px] text-muted-foreground">
                {lead.company}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground/70">
                  {lead.source}
                </span>
                <span className="text-[9px] text-muted-foreground/70">
                  {lead.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="min-w-0 flex-1 bg-background p-3 sm:p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-bold text-foreground">{activeLead.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {activeLead.company} · {activeLead.source}
              </p>
            </div>
            <TierBadge tier={activeLead.tier} className="text-xs" />
          </div>

          {/* Score + reasoning */}
          <div className="mb-3 rounded-xl bg-[#e8b44f]/15 p-3">
            <p className="mb-1 text-[10px] font-semibold text-foreground/80">
              Lead Score
            </p>
            <ScoreRing score={activeLead.score} />
            <p className="mt-2 text-[9px] leading-relaxed text-muted-foreground">
              VP Sales at 150 person FinTech. Budget $50k+, uses Salesforce.
              Matches ICP on size, industry, and intent signals.
            </p>
          </div>

          {/* Enrichment */}
          <div className="mb-3 rounded-xl bg-muted p-3">
            <p className="mb-2 text-[10px] font-semibold text-foreground/80">
              Enrichment
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ["Industry", "FinTech"],
                ["Employees", "150"],
                ["Funding", "Series B"],
                ["Tech", "Salesforce"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-card px-2 py-1">
                  <p className="text-[8px] text-muted-foreground">{k}</p>
                  <p className="text-[9px] font-medium text-foreground">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Draft reply */}
          <div className="rounded-xl bg-muted p-3">
            <p className="mb-2 text-[10px] font-semibold text-foreground/80">
              Draft Reply
            </p>
            <p className="text-[9px] leading-relaxed text-muted-foreground">
              Hi Sarah, thanks for reaching out about lead qualification. With
              a 25 person sales team, our Growth plan would be a great fit.
              Want me to send a tailored proposal?
            </p>
            <div className="mt-2 flex justify-end gap-2">
              <span className="rounded-full border border-border px-3 py-1 text-[9px] text-muted-foreground">
                Edit
              </span>
              <span className="rounded-full bg-primary px-3 py-1 text-[9px] font-bold text-black">
                Send
              </span>
            </div>
          </div>

          {/* Pipeline routing */}
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
            <div className="size-2 rounded-full bg-primary" />
            <p className="text-[9px] text-foreground/80">
              Routed to{" "}
              <span className="font-medium text-foreground">
                AE, Alex Rivera
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeadAnalysisMockup() {
  return (
    <div className="relative w-full max-w-[300px]">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-xs font-bold text-white">Agent Reasoning</p>
          <p className="text-[10px] text-white/50">Sarah Chen · Acme Corp</p>
        </div>
        <div className="space-y-3 p-4">
          {[
            {
              signal: "Company size",
              match: "150 employees — matches ICP (100–500)",
              pass: true,
            },
            {
              signal: "Budget signal",
              match: "Stated $50k+ annual budget",
              pass: true,
            },
            {
              signal: "Intent",
              match: "Requested demo within 48h",
              pass: true,
            },
            {
              signal: "Tech stack",
              match: "Uses Salesforce — integration ready",
              pass: true,
            },
          ].map((item) => (
            <div key={item.signal} className="flex gap-2">
              <span className="mt-0.5 size-4 shrink-0 rounded-full bg-primary text-center text-[9px] font-bold leading-4 text-black">
                ✓
              </span>
              <div>
                <p className="text-[10px] font-medium text-white">{item.signal}</p>
                <p className="text-[9px] text-white/50">{item.match}</p>
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-primary/15 px-3 py-2">
            <p className="text-[10px] font-bold text-primary">
              Score: 92 — HOT · Route to AE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CriteriaMockup() {
  return (
    <div className="relative w-full max-w-[300px]">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-xs font-bold text-white">Qualification Criteria</p>
          <p className="text-[10px] text-white/50">Acme Corp workspace</p>
        </div>
        <div className="space-y-2 p-4">
          {[
            { rule: "Company size", value: "100–500 employees", weight: "High" },
            { rule: "Budget", value: "$25k+ stated", weight: "High" },
            { rule: "Industry", value: "SaaS, FinTech, B2B", weight: "Medium" },
            { rule: "Intent", value: "Demo or pricing page", weight: "High" },
            { rule: "Reply tone", value: "Professional, concise", weight: "—" },
          ].map((item) => (
            <div
              key={item.rule}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
            >
              <div>
                <p className="text-[10px] font-medium text-white">{item.rule}</p>
                <p className="text-[9px] text-white/50">{item.value}</p>
              </div>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-medium text-primary">
                {item.weight}
              </span>
            </div>
          ))}
          <div className="mt-2 flex justify-center">
            <span className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold text-black">
              + Add criterion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
