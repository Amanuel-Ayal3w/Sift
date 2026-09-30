import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module.js';
import { QueueModule } from '../queue/queue.module.js';
import { WebhooksController } from './webhooks.controller.js';

@Module({
  imports: [QueueModule, LeadsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
