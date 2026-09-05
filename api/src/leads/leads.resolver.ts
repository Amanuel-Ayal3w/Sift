import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LeadStatus } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';
import { LeadsService } from './leads.service.js';
import { Lead } from './types/lead.type.js';

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(private readonly leadsService: LeadsService) {}

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
}
