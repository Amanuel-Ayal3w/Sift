import { InjectQueue } from '@nestjs/bullmq';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Queue } from 'bullmq';
import { Public } from '../auth/decorators/public.decorator.js';
import { LeadsPubSub } from '../leads/leads.pubsub.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LEAD_QUALIFICATION_QUEUE } from '../queue/queue.constants.js';
import type { LeadQualificationJobData } from '../queue/types/lead-qualification-job.type.js';
import { IngestLeadDto } from './dto/ingest-lead.dto.js';

@Controller('webhooks/leads')
export class WebhooksController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leadsPubSub: LeadsPubSub,
    @InjectQueue(LEAD_QUALIFICATION_QUEUE)
    private readonly queue: Queue<LeadQualificationJobData>,
  ) {}

  /**
   * Public ingestion endpoint — the per-workspace token in the path is the
   * credential. Qualification happens on the queue so a slow or unavailable
   * agent-service never blocks (or drops) an inbound lead.
   */
  @Public()
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Post(':token')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingest(
    @Param('token') token: string,
    @Body() body: IngestLeadDto,
  ): Promise<{ status: string; leadId: string }> {
    const org = await this.prisma.organization.findUnique({
      where: { webhookToken: token },
      select: { id: true },
    });
    if (!org) {
      throw new NotFoundException('Unknown webhook token');
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
      lead: body,
    });
    return { status: 'queued', leadId: lead.id };
  }
}
