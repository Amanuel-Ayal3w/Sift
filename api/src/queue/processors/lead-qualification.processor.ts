import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { LeadStatus, LeadTier } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AgentClient } from '../agent.client.js';
import { splitCriteria } from '../criteria.util.js';
import { deriveTier } from '../lead-tier.util.js';
import { LEAD_QUALIFICATION_QUEUE } from '../queue.constants.js';
import type { LeadQualificationJobData } from '../types/lead-qualification-job.type.js';
import { replySubject } from '../../mail/inbound-mail.js';
import { MailService } from '../../mail/mail.service.js';
import { LeadsPubSub } from '../../leads/leads.pubsub.js';

@Processor(LEAD_QUALIFICATION_QUEUE)
export class LeadQualificationProcessor extends WorkerHost {
  private readonly logger = new Logger(LeadQualificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly agent: AgentClient,
    private readonly leadsPubSub: LeadsPubSub,
    private readonly mail: MailService,
  ) {
    super();
  }

  async process(job: Job<LeadQualificationJobData>): Promise<void> {
    const { orgId, leadId, lead } = job.data;

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        name: true,
        productDescription: true,
        qualificationCriteria: true,
        replyTone: true,
        gmailUser: true,
        gmailAppPassword: true,
      },
    });
    if (!org) {
      // The workspace is gone; retrying will never help.
      this.logger.warn(`Dropping lead ${leadId} for unknown org ${orgId}`);
      return;
    }

    try {
      const result = await this.agent.qualify(lead, {
        name: org.name,
        productDescription: org.productDescription,
        qualificationCriteria: splitCriteria(org.qualificationCriteria),
        replyTone: org.replyTone,
      });

      await this.persistQualification(leadId, {
        score: result.fit_score,
        tier: deriveTier(result.fit_score, result.qualification),
        reasoning: result.reasoning,
        draftReply: result.draft_reply,
        keySignals: result.key_signals,
      });
      await this.emailReply(leadId, org, result.draft_reply, job.data);
    } catch (error) {
      const attempts = job.opts.attempts ?? 1;
      if (job.attemptsMade + 1 < attempts) {
        throw error;
      }

      // Retries are exhausted. Keep the row and mark it reviewed so it is
      // visible for manual triage rather than lost.
      this.logger.error(
        `Qualification failed for lead ${leadId} after ${attempts} attempts: ${String(error)}`,
      );
      await this.persistQualification(leadId, {
        score: 0,
        tier: LeadTier.WARM,
        reasoning:
          'Automatic qualification failed after repeated attempts; this lead needs manual review.',
        draftReply: '',
        keySignals: [],
      });
    }
  }

  private async persistQualification(
    leadId: string,
    data: {
      score: number;
      tier: LeadTier;
      reasoning: string;
      draftReply: string;
      keySignals: string[];
    },
  ): Promise<void> {
    const lead = await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        ...data,
        status: LeadStatus.REVIEWED,
      },
    });
    await this.leadsPubSub.publishLead(lead);
  }

  private async emailReply(
    leadId: string,
    org: { name: string; gmailUser: string | null; gmailAppPassword: string | null },
    draftReply: string,
    job: LeadQualificationJobData,
  ): Promise<void> {
    const text = draftReply.trim();
    const from =
      org.gmailUser && org.gmailAppPassword
        ? { user: org.gmailUser, appPassword: org.gmailAppPassword }
        : null;
    if (!text || !this.mail.canSend(from)) return;

    try {
      const sent = await this.mail.sendReply({
        to: job.lead.email,
        subject: replySubject(org.name, job.subject),
        text,
        replyToMessageId: job.replyToMessageId,
        from: from ?? undefined,
      });
      if (!sent) return;
      const lead = await this.prisma.lead.update({
        where: { id: leadId },
        data: { status: LeadStatus.CONTACTED },
      });
      await this.leadsPubSub.publishLead(lead);
    } catch (error) {
      this.logger.error(`Could not email ${job.lead.email} for lead ${leadId}: ${String(error)}`);
    }
  }
}
