import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import {
  authCookieOptions,
  PLATFORM_AUTH_COOKIE_NAME,
} from '../auth/auth.cookie.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { LoginInput } from '../auth/dto/login.input.js';
import { GqlThrottlerGuard } from '../auth/guards/gql-throttler.guard.js';
import { CurrentPlatformAdmin } from './decorators/current-platform-admin.decorator.js';
import { PlatformAuthGuard } from './guards/platform-auth.guard.js';
import { PlatformService } from './platform.service.js';
import { PlatformAdmin } from './types/platform-admin.type.js';
import { PlatformAuthPayload } from './types/platform-auth-payload.type.js';
import { BillingPlan } from '../billing/billing-plan.enum.js';
import { PlatformMetrics } from './types/platform-metrics.type.js';
import { PlatformOverview } from './types/platform-overview.type.js';
import { PlatformUser } from './types/platform-user.type.js';
import { PlatformWorkspace } from './types/platform-workspace.type.js';

@Resolver()
export class PlatformResolver {
  constructor(
    private readonly platform: PlatformService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => PlatformAuthPayload)
  async platformLogin(
    @Args('input') input: LoginInput,
    @Context() ctx: { res: Response },
  ): Promise<PlatformAuthPayload> {
    const { admin, token } = await this.platform.login(input);
    const expiresIn = this.config.getOrThrow<string>('jwtExpiresIn');
    ctx.res.cookie(PLATFORM_AUTH_COOKIE_NAME, token, authCookieOptions(expiresIn));
    return { admin };
  }

  @Public()
  @Mutation(() => Boolean)
  platformLogout(@Context() ctx: { res: Response }): boolean {
    ctx.res.clearCookie(PLATFORM_AUTH_COOKIE_NAME, {
      ...authCookieOptions(this.config.getOrThrow<string>('jwtExpiresIn')),
      maxAge: undefined,
    });
    return true;
  }

  @Public()
  @UseGuards(PlatformAuthGuard)
  @Query(() => PlatformAdmin)
  platformMe(@CurrentPlatformAdmin() admin: PlatformAdmin): PlatformAdmin {
    return admin;
  }

  @Public()
  @UseGuards(PlatformAuthGuard)
  @Query(() => PlatformOverview)
  platformOverview(): Promise<PlatformOverview> {
    return this.platform.overview();
  }

  @Public()
  @UseGuards(PlatformAuthGuard)
  @Query(() => PlatformMetrics)
  platformMetrics(): Promise<PlatformMetrics> {
    return this.platform.metrics();
  }

  @Public()
  @UseGuards(PlatformAuthGuard)
  @Query(() => [PlatformWorkspace])
  platformWorkspaces(): Promise<PlatformWorkspace[]> {
    return this.platform.workspaces();
  }

  @Public()
  @UseGuards(PlatformAuthGuard)
  @Query(() => [PlatformUser])
  platformUsers(): Promise<PlatformUser[]> {
    return this.platform.users();
  }

  @Public()
  @UseGuards(PlatformAuthGuard)
  @Mutation(() => PlatformWorkspace)
  setWorkspaceSuspended(
    @Args('id', { type: () => ID }) id: string,
    @Args('suspended') suspended: boolean,
  ): Promise<PlatformWorkspace> {
    return this.platform.setWorkspaceSuspended(id, suspended);
  }

  @Public()
  @UseGuards(PlatformAuthGuard)
  @Mutation(() => PlatformWorkspace)
  setWorkspacePlan(
    @Args('id', { type: () => ID }) id: string,
    @Args('plan', { type: () => BillingPlan }) plan: BillingPlan,
  ): Promise<PlatformWorkspace> {
    return this.platform.setWorkspacePlan(id, plan);
  }
}
