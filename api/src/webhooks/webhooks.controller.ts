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
import { PrismaService } from '../prisma/prisma.service.js';
import { LEAD_QUALIFICATION_QUEUE } from '../queue/queue.constants.js';
import type { LeadQualificationJobData } from '../queue/types/lead-qualification-job.type.js';
import { IngestLeadDto } from './dto/ingest-lead.dto.js';

@Controller('webhooks/leads')
export class WebhooksController {
  constructor(
    private readonly prisma: PrismaService,
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
  ): Promise<{ status: string }> {
    const org = await this.prisma.organization.findUnique({
      where: { webhookToken: token },
      select: { id: true },
    });
    if (!org) {
      throw new NotFoundException('Unknown webhook token');
    }

    await this.queue.add('qualify', { orgId: org.id, lead: body });
    return { status: 'queued' };
  }
}
