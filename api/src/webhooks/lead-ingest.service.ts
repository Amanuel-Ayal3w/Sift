import { InjectQueue } from '@nestjs/bullmq';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { LeadsPubSub } from '../leads/leads.pubsub.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LEAD_QUALIFICATION_QUEUE } from '../queue/queue.constants.js';
import type {
  IngestedLead,
  LeadQualificationJobData,
} from '../queue/types/lead-qualification-job.type.js';

export type IngestLeadInput = IngestedLead & {
  subject?: string;
  replyToMessageId?: string;
};

@Injectable()
export class LeadIngestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leadsPubSub: LeadsPubSub,
    @InjectQueue(LEAD_QUALIFICATION_QUEUE)
    private readonly queue: Queue<LeadQualificationJobData>,
  ) {}

  async ingest(
    token: string,
    body: IngestLeadInput,
  ): Promise<{ status: string; leadId: string }> {
    const org = await this.prisma.organization.findUnique({
      where: { webhookToken: token },
      select: { id: true, suspendedAt: true },
    });
    if (!org) {
      throw new NotFoundException('Unknown webhook token');
    }
    if (org.suspendedAt) {
      throw new ForbiddenException('Workspace is suspended');
    }

    const lead = await this.prisma.lead.create({
      data: {
        orgId: org.id,
        name: body.fullName,
        email: body.email,
        company: body.companyName ?? null,
        companyDomain: body.companyDomain ?? null,
        jobTitle: body.jobTitle ?? null,
        source: body.source ?? null,
        message: body.message,
        status: 'NEW',
      },
    });

    await this.leadsPubSub.publishLead(lead);
    await this.queue.add('qualify', {
      orgId: org.id,
      leadId: lead.id,
      lead: {
        fullName: body.fullName,
        email: body.email,
        companyName: body.companyName,
        companyDomain: body.companyDomain,
        jobTitle: body.jobTitle,
        message: body.message,
        source: body.source,
      },
      subject: body.subject,
      replyToMessageId: body.replyToMessageId,
    });
    return { status: 'queued', leadId: lead.id };
  }
}
