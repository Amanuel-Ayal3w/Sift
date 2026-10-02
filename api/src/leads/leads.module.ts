import { Module } from '@nestjs/common';
import { LeadsPubSub } from './leads.pubsub.js';
import { LeadsResolver } from './leads.resolver.js';
import { LeadsService } from './leads.service.js';

@Module({
  providers: [LeadsService, LeadsResolver, LeadsPubSub],
  exports: [LeadsService, LeadsPubSub],
})
export class LeadsModule {}
