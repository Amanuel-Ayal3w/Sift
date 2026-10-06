export const PLAN_MONTHLY_PRICE = {
  TRIAL: 0,
  STARTER: 49,
  GROWTH: 149,
} as const;

export type PlanName = keyof typeof PLAN_MONTHLY_PRICE;

export type PlanRevenue = {
  plan: PlanName;
  workspaces: number;
  monthlyRevenue: number;
};

export type RevenueSummary = {
  mrr: number;
  arr: number;
  payingWorkspaces: number;
  trialWorkspaces: number;
  plans: PlanRevenue[];
};

const PLAN_ORDER: PlanName[] = ['TRIAL', 'STARTER', 'GROWTH'];

/** Revenue from active workspaces at the published monthly prices. */
export function summarizeRevenue(
  orgs: { plan: PlanName; suspended: boolean }[],
): RevenueSummary {
  const active = orgs.filter((org) => !org.suspended);
  const plans = PLAN_ORDER.map((plan) => {
    const workspaces = active.filter((org) => org.plan === plan).length;
    return {
      plan,
      workspaces,
      monthlyRevenue: workspaces * PLAN_MONTHLY_PRICE[plan],
    };
  });
  const mrr = plans.reduce((sum, plan) => sum + plan.monthlyRevenue, 0);
  return {
    mrr,
    arr: mrr * 12,
    payingWorkspaces: active.filter((org) => PLAN_MONTHLY_PRICE[org.plan] > 0).length,
    trialWorkspaces: active.filter((org) => org.plan === 'TRIAL').length,
    plans,
  };
}

export type DayActivity = {
  date: string;
  leads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  workspaces: number;
  users: number;
};

/** UTC calendar days ending on `now`, oldest first. */
export function utcDayKeys(count: number, now: Date): string[] {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const days: string[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() - offset);
    days.push(day.toISOString().slice(0, 10));
  }
  return days;
}

export function activityByDay(
  days: string[],
  leads: { createdAt: Date; tier: 'HOT' | 'WARM' | 'COLD' | null }[],
  workspaces: { createdAt: Date }[],
  users: { createdAt: Date }[],
): DayActivity[] {
  const buckets = new Map<string, DayActivity>(
    days.map((date) => [
      date,
      { date, leads: 0, hotLeads: 0, warmLeads: 0, coldLeads: 0, workspaces: 0, users: 0 },
    ]),
  );

  for (const lead of leads) {
    const bucket = buckets.get(lead.createdAt.toISOString().slice(0, 10));
    if (!bucket) continue;
    bucket.leads += 1;
    if (lead.tier === 'HOT') bucket.hotLeads += 1;
    if (lead.tier === 'WARM') bucket.warmLeads += 1;
    if (lead.tier === 'COLD') bucket.coldLeads += 1;
  }
  for (const workspace of workspaces) {
    const bucket = buckets.get(workspace.createdAt.toISOString().slice(0, 10));
    if (bucket) bucket.workspaces += 1;
  }
  for (const user of users) {
    const bucket = buckets.get(user.createdAt.toISOString().slice(0, 10));
    if (bucket) bucket.users += 1;
  }

  return days.map((date) => buckets.get(date)!);
}
