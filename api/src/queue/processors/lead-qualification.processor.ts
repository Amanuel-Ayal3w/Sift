import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { LeadTier } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AgentClient } from '../agent.client.js';
import { splitCriteria } from '../criteria.util.js';
import { deriveTier } from '../lead-tier.util.js';
import { LEAD_QUALIFICATION_QUEUE } from '../queue.constants.js';
import type {
  IngestedLead,
  LeadQualificationJobData,
} from '../types/lead-qualification-job.type.js';

@Processor(LEAD_QUALIFICATION_QUEUE)
export class LeadQualificationProcessor extends WorkerHost {
  private readonly logger = new Logger(LeadQualificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly agent: AgentClient,
  ) {
    super();
  }

  async process(job: Job<LeadQualificationJobData>): Promise<void> {
    const { orgId, lead } = job.data;

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        name: true,
        productDescription: true,
        qualificationCriteria: true,
        replyTone: true,
      },
    });
    if (!org) {
      // The workspace is gone; retrying will never help.
      this.logger.warn(`Dropping lead for unknown org ${orgId}`);
      return;
    }

    try {
      const result = await this.agent.qualify(lead, {
        name: org.name,
        productDescription: org.productDescription,
        qualificationCriteria: splitCriteria(org.qualificationCriteria),
        replyTone: org.replyTone,
      });

      await this.prisma.lead.create({
        data: {
          ...this.leadColumns(orgId, lead),
          score: result.fit_score,
          tier: deriveTier(result.fit_score, result.qualification),
          reasoning: result.reasoning,
          draftReply: result.draft_reply,
          keySignals: result.key_signals,
        },
      });
    } catch (error) {
      const attempts = job.opts.attempts ?? 1;
      if (job.attemptsMade + 1 < attempts) {
        throw error;
      }

      // Retries are exhausted. Store the lead unqualified rather than losing
      // it — WARM keeps it in the middle of triage instead of buried.
      this.logger.error(
        `Qualification failed for org ${orgId} after ${attempts} attempts: ${String(error)}`,
      );
      await this.prisma.lead.create({
        data: {
          ...this.leadColumns(orgId, lead),
          score: 0,
          tier: LeadTier.WARM,
          reasoning:
            'Automatic qualification failed after repeated attempts; this lead needs manual review.',
          draftReply: '',
          keySignals: [],
        },
      });
    }
  }

  private leadColumns(orgId: string, lead: IngestedLead) {
    return {
      orgId,
      name: lead.fullName,
      email: lead.email,
      company: lead.companyName ?? null,
      companyDomain: lead.companyDomain ?? null,
      jobTitle: lead.jobTitle ?? null,
      source: lead.source ?? null,
      message: lead.message,
    };
  }
}
