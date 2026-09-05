export interface IngestedLead {
  fullName: string;
  email: string;
  companyName?: string;
  companyDomain?: string;
  jobTitle?: string;
  message: string;
  source?: string;
}

export interface LeadQualificationJobData {
  orgId: string;
  lead: IngestedLead;
}

/** Mirrors `LeadQualification` in agent-service/app/schemas.py. */
export interface AgentQualification {
  fit_score: number;
  qualification: 'qualified' | 'unqualified' | 'needs_review';
  reasoning: string;
  key_signals: string[];
  draft_reply: string;
}

export interface AgentQualifyResponse {
  result: AgentQualification;
  model: string;
}
