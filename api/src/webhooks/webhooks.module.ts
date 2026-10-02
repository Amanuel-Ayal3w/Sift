import { Module } from '@nestjs/common';
import { InboxPoller } from '../mail/inbox.poller.js';
import { LeadsModule } from '../leads/leads.module.js';
import { QueueModule } from '../queue/queue.module.js';
import { LeadIngestService } from './lead-ingest.service.js';
import { WebhooksController } from './webhooks.controller.js';

@Module({
  imports: [QueueModule, LeadsModule],
  controllers: [WebhooksController],
  providers: [LeadIngestService, InboxPoller],
})
export class WebhooksModule {}
