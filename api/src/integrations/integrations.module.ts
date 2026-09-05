import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module.js';
import { IntegrationsResolver } from './integrations.resolver.js';
import { IntegrationsService } from './integrations.service.js';

@Module({
  imports: [WorkspaceModule],
  providers: [IntegrationsService, IntegrationsResolver],
})
export class IntegrationsModule {}
