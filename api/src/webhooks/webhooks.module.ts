import { Module } from '@nestjs/common';
import { QueueModule } from '../queue/queue.module.js';
import { WebhooksController } from './webhooks.controller.js';

@Module({
  imports: [QueueModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
