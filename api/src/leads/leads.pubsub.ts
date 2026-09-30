import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Lead } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { Redis } from 'ioredis';

export const LEAD_UPDATED_TRIGGER = 'leadUpdated';
const REDIS_CHANNEL = 'sift:leadUpdated';

@Injectable()
export class LeadsPubSub implements OnModuleDestroy {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly local = new PubSub();

  constructor(config: ConfigService) {
    const url = config.getOrThrow<string>('redisUrl');
    this.publisher = new Redis(url, { maxRetriesPerRequest: null });
    this.subscriber = new Redis(url, { maxRetriesPerRequest: null });
    void this.subscriber.subscribe(REDIS_CHANNEL);
    this.subscriber.on('message', (channel: string, message: string) => {
      if (channel !== REDIS_CHANNEL) {
        return;
      }
      const lead = JSON.parse(message) as Lead;
      void this.local.publish(LEAD_UPDATED_TRIGGER, {
        leadUpdated: {
          ...lead,
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt),
        },
      });
    });
  }

  async publishLead(lead: Lead): Promise<void> {
    await this.publisher.publish(REDIS_CHANNEL, JSON.stringify(lead));
  }

  asyncIterator() {
    return this.local.asyncIterableIterator(LEAD_UPDATED_TRIGGER);
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
  }
}
