import type { ReactNode } from "react";
import Link from "next/link";
import {
  Bell,
  Inbox,
  ListFilter,
  Plug,
  Settings,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";
import { RingMeter } from "@/components/dashboard/ring-meter";
import { Sparkline } from "@/components/dashboard/sparkline";
import { type Lead } from "@/lib/graphql/leads";
import { avatarTone, formatRelativeTime, initials } from "@/lib/utils";

const DEMO_SPARK = [8, 11, 9, 14, 12, 16, 18];
const DEMO_TODAY_SPARK = [2, 3, 1, 4, 2, 5, 3];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysAgo(n: number) {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() - n);
  return date;
}

function countsByDay(leads: Lead[], days: number) {
  const buckets = Array.from({ length: days }, () => 0);
  const origin = daysAgo(days - 1).getTime();
  for (const lead of leads) {
    const offset = Math.floor(
      (new Date(lead.createdAt).getTime() - origin) / 86_400_000
    );
    if (offset >= 0 && offset < days) buckets[offset] += 1;
  }
  return buckets;
}

function activityLabel(lead: Lead) {
  if (lead.status === "CONTACTED") {
    return { title: "Reply emailed", tag: "emailed", tagClass: "text-primary" };
  }
  if (lead.status === "REVIEWED" || lead.tier) {
    return { title: "Lead qualified", tag: "qualified", tagClass: "text-primary" };
  }
  if (lead.draftReply) {
    return { title: "Draft reply ready", tag: "draft", tagClass: "text-primary" };
  }
  return { title: "New lead received", tag: "inbox", tagClass: "text-muted-foreground" };
}

const QUICK_LINKS = [
  { href: "/dashboard/leads", icon: ListFilter, title: "Leads", hint: "Search scored pipeline" },
  { href: "/dashboard/criteria", icon: SlidersHorizontal, title: "Criteria", hint: "Tune qualification" },
  { href: "/dashboard", icon: Inbox, title: "Inbox", hint: "Review new leads" },
  { href: "/dashboard/settings", icon: Settings, title: "Settings", hint: "Workspace & account" },
];

export function OverviewMetrics({ leads }: { leads: Lead[] }) {
  const hasData = leads.length > 0;
  const now = new Date();
  const todayStart = startOfDay(now).getTime();
  const weekStart = daysAgo(6).getTime();

  const thisWeek = leads.filter((lead) => new Date(lead.createdAt).getTime() >= weekStart);
  const today = leads.filter((lead) => new Date(lead.createdAt).getTime() >= todayStart);
  const qualified = leads.filter(
    (lead) => lead.score != null || lead.tier != null || lead.status !== "NEW"
  );
  const hot = leads.filter((lead) => lead.tier === "HOT");
  const contacted = leads.filter((lead) => lead.status === "CONTACTED");
  const inbox = leads.filter((lead) => lead.status === "NEW");
  const scored = leads.filter((lead) => lead.score != null);
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, lead) => sum + (lead.score ?? 0), 0) / scored.length)
    : 0;

  const total = hasData ? leads.length : 128;
  const weekCount = hasData ? thisWeek.length : 14;
  const todayCount = hasData ? today.length : 9;
  const weekActive = hasData ? thisWeek.length : 22;
  const qualifiedCount = hasData ? qualified.length : 86;
  const qualifiedTotal = hasData ? Math.max(leads.length, 1) : 100;
  const qualifiedPct = Math.round((qualifiedCount / qualifiedTotal) * 100);
  const hotPct = hasData
    ? Math.round((hot.length / Math.max(qualified.length, 1)) * 100)
    : 70;
  const spark = hasData ? countsByDay(leads, 7) : DEMO_SPARK;
  const todaySpark = hasData
    ? countsByDay(
        leads.filter((lead) => lead.status === "NEW" || lead.status === "REVIEWED"),
        7
      )
    : DEMO_TODAY_SPARK;

  const recentLeads = (hasData ? [...leads] : demoLeads)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  const recentActivity = recentLeads.map((lead) => ({
    lead,
    ...activityLabel(lead),
  }));

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-card glass">
        <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
          <MetricCell
            label="Total leads"
            value={total}
            hint={`+${weekCount} this week`}
            graphic={<Sparkline values={spark} className="h-7 w-[72px] shrink-0 text-muted-foreground" />}
          />
          <MetricCell
            label="Active today"
            value={todayCount}
            hint={`${weekActive} this week`}
            graphic={<Sparkline values={todaySpark} className="h-7 w-[72px] shrink-0 text-muted-foreground" />}
          />
          <MetricCell
            label="Qualified"
            value={`${qualifiedPct}%`}
            hint={`${qualifiedCount}/${qualifiedTotal}`}
            graphic={<RingMeter percent={qualifiedPct} />}
          />
          <MetricCell
            label="Hot rate"
            value={`${hotPct}%`}
            hint="ready to close"
            graphic={<RingMeter percent={hotPct} />}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card glass">
        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <MiniStat
            icon={<UserPlus className="size-4 text-muted-foreground" />}
            value={`+${hasData ? inbox.length : 18}`}
            hint="inbox (new)"
          />
          <MiniStat
            icon={<Plug className="size-4 text-muted-foreground" />}
            value={hasData ? contacted.length : 6}
            hint="emailed"
          />
          <MiniStat
            icon={<Bell className="size-4 text-muted-foreground" />}
            value={hasData ? avgScore || "—" : 82}
            hint="avg score"
          />
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <ListCard
          title="Recent leads"
          href="/dashboard/leads"
        >
          {recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center gap-3 px-5 py-3"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${avatarTone(lead.email)}`}
              >
                {initials(lead.name) || "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{lead.name}</p>
                <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(lead.createdAt)}
              </span>
            </div>
          ))}
        </ListCard>

        <ListCard title="Recent activity" href="/dashboard">
          {recentActivity.map(({ lead, title, tag, tagClass }) => (
            <div key={lead.id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`text-[10px] font-medium ${tagClass}`}>
                    {tag}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {lead.name}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(lead.createdAt)}
              </span>
            </div>
          ))}
        </ListCard>
      </div>

      <div className="rounded-2xl border border-border bg-card glass">
        <div className="px-5 py-3">
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Quick links
          </p>
        </div>
        <div className="grid sm:grid-cols-2">
          {QUICK_LINKS.map((link, index) => (
            <Link
              key={link.title}
              href={link.href}
              className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50 ${
                index < 2 ? "border-b border-border" : ""
              } ${index % 2 === 0 ? "sm:border-r sm:border-border" : ""}`}
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <link.icon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">{link.title}</span>
                <span className="block text-xs text-muted-foreground">{link.hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCell({
  label,
  value,
  hint,
  graphic,
}: {
  label: string;
  value: string | number;
  hint: string;
  graphic: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-5">
      <div>
        <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-2 text-[28px] font-medium tracking-tight text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="shrink-0">{graphic}</div>
    </div>
  );
}

function MiniStat({
  icon,
  value,
  hint,
}: {
  icon: ReactNode;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      {icon}
      <p className="text-sm">
        <span className="font-medium text-foreground">{value}</span>{" "}
        <span className="text-muted-foreground">{hint}</span>
      </p>
    </div>
  );
}

function ListCard({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card glass">
      <div className="flex items-center justify-between px-5 py-3">
        <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {title}
        </p>
        <Link
          href={href}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all →
        </Link>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

const demoLeads: Lead[] = [
  {
    id: "demo-1",
    name: "Sarah Chen",
    email: "sarah@acme.io",
    company: "Acme Corp",
    source: "Inbound Form",
    message: "Looking for a lead qualification tool for a 150 person team.",
    score: 92,
    tier: "HOT",
    status: "REVIEWED",
    reasoning: null,
    draftReply: "Hi Sarah — thanks for reaching out.",
    createdAt: new Date(Date.now() - 46 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-2",
    name: "James Doe",
    email: "james@northwind.io",
    company: "Northwind",
    source: "Webhook",
    message: "Can you score inbound leads from our CRM?",
    score: 76,
    tier: "WARM",
    status: "NEW",
    reasoning: null,
    draftReply: null,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-3",
    name: "Elena Voss",
    email: "elena@pinnacle.io",
    company: "Pinnacle SaaS",
    source: "Partner Referral",
    message: "Referred by Northwind. Budget is approved.",
    score: 86,
    tier: "HOT",
    status: "CONTACTED",
    reasoning: null,
    draftReply: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-4",
    name: "David Kim",
    email: "david@relayhq.io",
    company: "RelayHQ",
    source: "Event Signup",
    message: "Met at the booth. Wants a walkthrough.",
    score: 78,
    tier: "WARM",
    status: "REVIEWED",
    reasoning: null,
    draftReply: "Hi David, great meeting you.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-5",
    name: "Priya Shah",
    email: "priya@globex.io",
    company: "Globex",
    source: "Demo Request",
    message: "Booked a demo for the sales team.",
    score: 81,
    tier: "HOT",
    status: "NEW",
    reasoning: null,
    draftReply: null,
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },
];
