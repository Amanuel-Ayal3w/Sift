import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AgentClient } from './agent.client.js';
import { LeadQualificationProcessor } from './processors/lead-qualification.processor.js';
import { LEAD_QUALIFICATION_QUEUE } from './queue.constants.js';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = new URL(config.getOrThrow<string>('redisUrl'));
        return {
          connection: {
            host: url.hostname,
            port: Number(url.port || 6379),
            username: url.username || undefined,
            password: url.password || undefined,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: LEAD_QUALIFICATION_QUEUE,
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: 1_000,
        removeOnFail: 5_000,
      },
    }),
  ],
  providers: [AgentClient, LeadQualificationProcessor],
  exports: [BullModule],
})
export class QueueModule {}
