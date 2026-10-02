import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator.js';
import { IngestLeadDto } from './dto/ingest-lead.dto.js';
import { LeadIngestService } from './lead-ingest.service.js';

@Controller('webhooks/leads')
export class WebhooksController {
  constructor(private readonly ingest: LeadIngestService) {}

  /**
   * Public ingestion endpoint — the per-workspace token in the path is the
   * credential. Qualification happens on the queue so a slow or unavailable
   * agent-service never blocks (or drops) an inbound lead.
   */
  @Public()
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Post(':token')
  @HttpCode(HttpStatus.ACCEPTED)
  ingestLead(
    @Param('token') token: string,
    @Body() body: IngestLeadDto,
  ): Promise<{ status: string; leadId: string }> {
    return this.ingest.ingest(token, body);
  }
}
