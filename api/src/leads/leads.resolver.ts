import { Args, ID, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import type { Lead as PrismaLead } from '@prisma/client';
import { LeadStatus } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';
import { LeadsPubSub } from './leads.pubsub.js';
import { LeadsService } from './leads.service.js';
import { Lead } from './types/lead.type.js';

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly leadsPubSub: LeadsPubSub,
  ) {}

  @Query(() => [Lead])
  leads(
    @CurrentUser() current: AuthenticatedUser,
    @Args('status', { type: () => LeadStatus, nullable: true })
    status?: LeadStatus,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit = 50,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset = 0,
  ): Promise<Lead[]> {
    return this.leadsService.findMany(current.orgId, {
      status,
      limit: Math.min(limit, 200),
      offset,
    });
  }

  @Query(() => Lead)
  lead(
    @CurrentUser() current: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Lead> {
    return this.leadsService.findOne(current.orgId, id);
  }

  @Mutation(() => Lead)
  updateLeadStatus(
    @CurrentUser() current: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => LeadStatus }) status: LeadStatus,
  ): Promise<Lead> {
    return this.leadsService.updateStatus(current.orgId, id, status);
  }

  @Subscription(() => Lead, {
    filter: (
      payload: { leadUpdated: PrismaLead },
      _variables: unknown,
      context: { req?: { user?: AuthenticatedUser } },
    ) => payload.leadUpdated.orgId === context.req?.user?.orgId,
  })
  leadUpdated() {
    return this.leadsPubSub.asyncIterator();
  }
}
