import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  AgentQualification,
  AgentQualifyResponse,
  IngestedLead,
} from './types/lead-qualification-job.type.js';

export interface AgentOrgContext {
  name: string;
  productDescription: string;
  qualificationCriteria: string[];
  replyTone: string | null;
}

const REQUEST_TIMEOUT_MS = 30_000;

@Injectable()
export class AgentClient {
  private readonly logger = new Logger(AgentClient.name);

  constructor(private readonly config: ConfigService) {}

  /** Calls agent-service POST /leads/qualify. Throws so BullMQ can retry. */
  async qualify(
    lead: IngestedLead,
    org: AgentOrgContext,
  ): Promise<AgentQualification> {
    const baseUrl = this.config
      .getOrThrow<string>('agentServiceUrl')
      .replace(/\/+$/, '');

    const response = await fetch(`${baseUrl}/leads/qualify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        lead: {
          full_name: lead.fullName,
          email: lead.email,
          company_name: lead.companyName ?? null,
          company_domain: lead.companyDomain ?? null,
          job_title: lead.jobTitle ?? null,
          message: lead.message,
          source: lead.source ?? null,
        },
        org: {
          org_name: org.name,
          product_description: org.productDescription,
          qualification_criteria: org.qualificationCriteria,
          reply_tone: org.replyTone,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.warn(
        `agent-service returned ${response.status}: ${body.slice(0, 300)}`,
      );
      throw new Error(`agent-service responded with ${response.status}`);
    }

    const payload = (await response.json()) as AgentQualifyResponse;
    return payload.result;
  }
}
