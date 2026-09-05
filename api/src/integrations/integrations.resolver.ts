import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';
import { IntegrationsService } from './integrations.service.js';
import { IntegrationsPayload } from './types/integrations.type.js';

@Resolver(() => IntegrationsPayload)
export class IntegrationsResolver {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Query(() => IntegrationsPayload)
  integrations(
    @CurrentUser() current: AuthenticatedUser,
  ): Promise<IntegrationsPayload> {
    return this.integrationsService.findForOrg(current.orgId);
  }
}
