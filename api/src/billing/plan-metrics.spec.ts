import { activityByDay, summarizeRevenue, utcDayKeys } from './plan-metrics.js';

describe('plan revenue', () => {
  it('prices active workspaces and leaves suspended ones out', () => {
    const summary = summarizeRevenue([
      { plan: 'GROWTH', suspended: false },
      { plan: 'STARTER', suspended: false },
      { plan: 'STARTER', suspended: true },
      { plan: 'TRIAL', suspended: false },
    ]);

    expect(summary.mrr).toBe(149 + 49);
    expect(summary.arr).toBe(198 * 12);
    expect(summary.payingWorkspaces).toBe(2);
    expect(summary.trialWorkspaces).toBe(1);
    expect(summary.plans).toEqual([
      { plan: 'TRIAL', workspaces: 1, monthlyRevenue: 0 },
      { plan: 'STARTER', workspaces: 1, monthlyRevenue: 49 },
      { plan: 'GROWTH', workspaces: 1, monthlyRevenue: 149 },
    ]);
  });
});

describe('daily activity', () => {
  it('buckets leads, signups, and users onto UTC days', () => {
    const days = utcDayKeys(3, new Date('2026-10-06T15:00:00.000Z'));
    expect(days).toEqual(['2026-10-04', '2026-10-05', '2026-10-06']);

    const series = activityByDay(
      days,
      [
        { createdAt: new Date('2026-10-06T01:00:00.000Z'), tier: 'HOT' },
        { createdAt: new Date('2026-10-05T23:00:00.000Z'), tier: 'WARM' },
        { createdAt: new Date('2026-09-01T00:00:00.000Z'), tier: 'COLD' },
      ],
      [{ createdAt: new Date('2026-10-04T12:00:00.000Z') }],
      [{ createdAt: new Date('2026-10-06T18:00:00.000Z') }],
    );

    expect(series[0]).toMatchObject({ date: '2026-10-04', workspaces: 1, leads: 0 });
    expect(series[1]).toMatchObject({ date: '2026-10-05', leads: 1, warmLeads: 1 });
    expect(series[2]).toMatchObject({ date: '2026-10-06', leads: 1, hotLeads: 1, users: 1 });
  });
});
