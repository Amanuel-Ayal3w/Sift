"use client";

import { useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlatformDay, PlatformMetrics, PlatformOverview } from "@/lib/graphql/platform";

const PLAN_LABEL: Record<string, string> = {
  TRIAL: "Trial",
  STARTER: "Starter",
  GROWTH: "Growth",
};

function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function dayLabel(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function AdminMetrics({
  overview,
  metrics,
}: {
  overview?: PlatformOverview;
  metrics?: PlatformMetrics;
}) {
  const days = metrics?.days ?? [];
  const weekLeads = days.slice(-7).reduce((sum, day) => sum + day.leads, 0);
  const qualified =
    overview == null
      ? null
      : overview.leadCount === 0
        ? 0
        : Math.round(
            ((overview.reviewedLeads + overview.contactedLeads) / overview.leadCount) * 100,
          );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Monthly revenue"
          value={metrics ? money(metrics.mrr) : "—"}
          hint={metrics ? `${money(metrics.arr)} a year` : undefined}
        />
        <Stat
          label="Leads this week"
          value={metrics ? weekLeads : "—"}
          hint={overview ? `${overview.leadCount} all time` : undefined}
        />
        <Stat
          label="Qualified"
          value={qualified == null ? "—" : `${qualified}%`}
          hint={metrics ? `Average score ${metrics.averageScore}` : undefined}
        />
        <Stat
          label="Paying workspaces"
          value={metrics ? metrics.payingWorkspaces : "—"}
          hint={
            metrics
              ? `${metrics.trialWorkspaces} on trial · ${metrics.mailboxCount} ${metrics.mailboxCount === 1 ? "mailbox" : "mailboxes"}`
              : undefined
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="border-border xl:col-span-3">
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <p className="text-sm text-muted-foreground">New leads each day, last 30 days</p>
          </CardHeader>
          <CardContent>
            <AreaChart
              values={days.map((day) => day.leads)}
              labels={days.map((day) => day.date)}
            />
          </CardContent>
        </Card>

        <Card className="border-border xl:col-span-2">
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <p className="text-sm text-muted-foreground">
              Active workspaces at the listed monthly price
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-3xl font-medium tracking-tight">
                {metrics ? money(metrics.mrr) : "—"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {metrics ? `${money(metrics.arr)} billed over a year` : "Monthly recurring"}
              </p>
            </div>
            <PlanBars plans={metrics?.plans ?? []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Signups</CardTitle>
            <p className="text-sm text-muted-foreground">New workspaces and users, last 30 days</p>
          </CardHeader>
          <CardContent>
            <ColumnChart days={days} />
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <Legend swatch="bg-primary" label="Workspaces" />
              <Legend swatch="bg-foreground/35" label="Users" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Pipeline</CardTitle>
            <p className="text-sm text-muted-foreground">Tier mix and where leads sit now</p>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <TierDonut
              hot={overview?.hotLeads ?? 0}
              warm={overview?.warmLeads ?? 0}
              cold={overview?.coldLeads ?? 0}
            />
            <StatusBars
              rows={[
                { label: "New", value: overview?.newLeads ?? 0 },
                { label: "Reviewed", value: overview?.reviewedLeads ?? 0 },
                { label: "Contacted", value: overview?.contactedLeads ?? 0 },
                { label: "Archived", value: overview?.archivedLeads ?? 0 },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-medium tracking-tight text-foreground">{value}</p>
        {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${swatch}`} />
      {label}
    </span>
  );
}

function AreaChart({ values, labels }: { values: number[]; labels: string[] }) {
  const gradientId = useId().replace(/:/g, "");
  if (values.length === 0) {
    return <p className="py-10 text-sm text-muted-foreground">No activity yet.</p>;
  }

  const width = 640;
  const height = 200;
  const pad = { top: 16, right: 8, bottom: 28, left: 32 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(...values, 1);
  const coords = values.map((value, index) => {
    const x =
      pad.left + (values.length === 1 ? innerW / 2 : (index / (values.length - 1)) * innerW);
    const y = pad.top + innerH - (value / max) * innerH;
    return { x, y };
  });
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const baseline = pad.top + innerH;
  const area = `${coords[0].x},${baseline} ${line} ${coords[coords.length - 1].x},${baseline}`;
  const ticks = [0, Math.ceil(max / 2), max].filter(
    (tick, index, all) => all.indexOf(tick) === index,
  );
  const labelEvery = Math.ceil(labels.length / 6);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full text-primary"
      role="img"
      aria-label="Leads over the last 30 days"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((tick) => {
        const y = pad.top + innerH - (tick / max) * innerH;
        return (
          <g key={tick} className="text-border">
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
            />
            <text
              x={pad.left - 6}
              y={y + 3}
              textAnchor="end"
              className="fill-current text-muted-foreground"
              fontSize="10"
            >
              {tick}
            </text>
          </g>
        );
      })}
      <polygon points={area} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {labels.map((label, index) =>
        index % labelEvery === 0 ? (
          <text
            key={label}
            x={coords[index].x}
            y={height - 6}
            textAnchor="middle"
            className="fill-current text-muted-foreground"
            fontSize="10"
          >
            {dayLabel(label)}
          </text>
        ) : null,
      )}
    </svg>
  );
}

function ColumnChart({ days }: { days: PlatformDay[] }) {
  if (days.length === 0) {
    return <p className="py-10 text-sm text-muted-foreground">No signups yet.</p>;
  }

  const width = 640;
  const height = 180;
  const pad = { top: 12, right: 8, bottom: 28, left: 28 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(...days.flatMap((day) => [day.workspaces, day.users]), 1);
  const slot = innerW / days.length;
  const bar = Math.max(2, Math.min(7, slot * 0.32));
  const labelEvery = Math.ceil(days.length / 6);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="New workspaces and users over the last 30 days"
    >
      <line
        x1={pad.left}
        x2={width - pad.right}
        y1={pad.top + innerH}
        y2={pad.top + innerH}
        className="text-border"
        stroke="currentColor"
      />
      {days.map((day, index) => {
        const cx = pad.left + slot * index + slot / 2;
        const workspaceH = (day.workspaces / max) * innerH;
        const userH = (day.users / max) * innerH;
        return (
          <g key={day.date}>
            <rect
              x={cx - bar - 1}
              y={pad.top + innerH - workspaceH}
              width={bar}
              height={workspaceH}
              rx="1.5"
              className="fill-current text-primary"
            />
            <rect
              x={cx + 1}
              y={pad.top + innerH - userH}
              width={bar}
              height={userH}
              rx="1.5"
              className="fill-current text-foreground/40"
            />
            {index % labelEvery === 0 && (
              <text
                x={cx}
                y={height - 6}
                textAnchor="middle"
                className="fill-current text-muted-foreground"
                fontSize="10"
              >
                {dayLabel(day.date)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TierDonut({ hot, warm, cold }: { hot: number; warm: number; cold: number }) {
  const slices = [
    { label: "Hot", value: hot, className: "text-orange-500" },
    { label: "Warm", value: warm, className: "text-primary" },
    { label: "Cold", value: cold, className: "text-sky-500" },
  ];
  const total = hot + warm + cold;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="size-28 -rotate-90" role="img" aria-label="Leads by tier">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="12"
          className="text-muted"
          stroke="currentColor"
        />
        {total > 0 &&
          slices.map((slice) => {
            const length = (slice.value / total) * circumference;
            const circle = (
              <circle
                key={slice.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                strokeWidth="12"
                strokeLinecap="butt"
                stroke="currentColor"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                className={slice.className}
              />
            );
            offset += length;
            return circle;
          })}
      </svg>
      <ul className="space-y-2 text-sm">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2">
            <span className={`size-2 rounded-full bg-current ${slice.className}`} />
            <span className="text-muted-foreground">{slice.label}</span>
            <span className="font-medium">{slice.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PlanBars({
  plans,
}: {
  plans: { plan: string; workspaces: number; monthlyRevenue: number }[];
}) {
  const max = Math.max(...plans.map((plan) => plan.workspaces), 1);
  if (plans.length === 0) {
    return <p className="text-sm text-muted-foreground">No workspaces yet.</p>;
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => (
        <div key={plan.plan}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span>{PLAN_LABEL[plan.plan] ?? plan.plan}</span>
            <span className="text-muted-foreground">
              {plan.workspaces} · {money(plan.monthlyRevenue)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${plan.workspaces === 0 ? 0 : Math.max((plan.workspaces / max) * 100, 8)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
