import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module.js';
import { LeadsPubSub } from './leads.pubsub.js';
import { LeadsResolver } from './leads.resolver.js';
import { LeadsService } from './leads.service.js';

@Module({
  imports: [MailModule],
  providers: [LeadsService, LeadsResolver, LeadsPubSub],
  exports: [LeadsService, LeadsPubSub],
})
export class LeadsModule {}
