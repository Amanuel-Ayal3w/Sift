import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';
import { UpdateWorkspaceInput } from './dto/update-workspace.input.js';
import { Workspace } from './types/workspace.type.js';
import { WorkspaceService } from './workspace.service.js';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) {}

  // The workspace always comes from the caller's token, never from an argument.
  @Query(() => Workspace)
  workspace(@CurrentUser() current: AuthenticatedUser): Promise<Workspace> {
    return this.workspaceService.findById(current.orgId);
  }

  @Mutation(() => Workspace)
  updateWorkspace(
    @CurrentUser() current: AuthenticatedUser,
    @Args('input') input: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return this.workspaceService.update(current.orgId, input);
  }
}
