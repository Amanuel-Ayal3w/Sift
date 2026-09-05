import { LeadTier } from '@prisma/client';
import type { AgentQualification } from './types/lead-qualification-job.type.js';

/**
 * Collapses the agent's verdict plus score into the three tiers the dashboard
 * shows. Thresholds are a starting default, not tuned against real data.
 */
export function deriveTier(
  score: number,
  qualification: AgentQualification['qualification'],
): LeadTier {
  if (qualification === 'unqualified') {
    return LeadTier.COLD;
  }
  if (qualification === 'qualified') {
    return score >= 80 ? LeadTier.HOT : LeadTier.WARM;
  }
  return score >= 60 ? LeadTier.WARM : LeadTier.COLD;
}
