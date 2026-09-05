import { Module } from '@nestjs/common';
import { WorkspaceResolver } from './workspace.resolver.js';
import { WorkspaceService } from './workspace.service.js';

@Module({
  providers: [WorkspaceService, WorkspaceResolver],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
