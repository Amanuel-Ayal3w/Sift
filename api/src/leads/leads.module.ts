import { Module } from '@nestjs/common';
import { LeadsResolver } from './leads.resolver.js';
import { LeadsService } from './leads.service.js';

@Module({
  providers: [LeadsService, LeadsResolver],
  exports: [LeadsService],
})
export class LeadsModule {}
