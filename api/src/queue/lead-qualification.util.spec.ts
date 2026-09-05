import { LeadTier } from '@prisma/client';
import { durationToMs } from '../auth/auth.cookie.js';
import { splitCriteria } from './criteria.util.js';
import { deriveTier } from './lead-tier.util.js';

describe('splitCriteria', () => {
  it('turns a freeform blob into one criterion per line', () => {
    const text = `Qualify as HOT if the lead:
- Works at a company with 50-500 employees
* Has a stated budget of $25k+ per year

  • Requested a demo
`;
    expect(splitCriteria(text)).toEqual([
      'Qualify as HOT if the lead:',
      'Works at a company with 50-500 employees',
      'Has a stated budget of $25k+ per year',
      'Requested a demo',
    ]);
  });

  it('returns nothing for an empty blob', () => {
    expect(splitCriteria('')).toEqual([]);
    expect(splitCriteria('   \n\n  ')).toEqual([]);
  });
});

describe('deriveTier', () => {
  it('always cools an unqualified lead regardless of score', () => {
    expect(deriveTier(95, 'unqualified')).toBe(LeadTier.COLD);
  });

  it('splits qualified leads at 80', () => {
    expect(deriveTier(80, 'qualified')).toBe(LeadTier.HOT);
    expect(deriveTier(79, 'qualified')).toBe(LeadTier.WARM);
  });

  it('splits needs_review leads at 60 and never promotes to HOT', () => {
    expect(deriveTier(95, 'needs_review')).toBe(LeadTier.WARM);
    expect(deriveTier(60, 'needs_review')).toBe(LeadTier.WARM);
    expect(deriveTier(59, 'needs_review')).toBe(LeadTier.COLD);
  });
});

describe('durationToMs', () => {
  it('parses the JWT duration units', () => {
    expect(durationToMs('7d')).toBe(7 * 24 * 60 * 60 * 1000);
    expect(durationToMs('12h')).toBe(12 * 60 * 60 * 1000);
    expect(durationToMs('30m')).toBe(30 * 60 * 1000);
    expect(durationToMs('45s')).toBe(45_000);
  });

  it('treats a bare number as seconds', () => {
    expect(durationToMs('3600')).toBe(3_600_000);
  });

  it('rejects a value it cannot convert to a cookie lifetime', () => {
    expect(() => durationToMs('7 days')).toThrow(/Unsupported JWT_EXPIRES_IN/);
  });
});
