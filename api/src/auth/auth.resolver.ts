import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AUTH_COOKIE_NAME, authCookieOptions } from './auth.cookie.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { LoginInput } from './dto/login.input.js';
import { SignupInput } from './dto/signup.input.js';
import { GqlThrottlerGuard } from './guards/gql-throttler.guard.js';
import { AuthPayload } from './types/auth-payload.type.js';
import type { AuthenticatedUser } from './types/jwt-payload.type.js';
import { User } from './types/user.type.js';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Mutation(() => AuthPayload)
  async signup(
    @Args('input') input: SignupInput,
    @Context() ctx: { res: Response },
  ): Promise<AuthPayload> {
    const { user, token } = await this.authService.signup(input);
    this.setAuthCookie(ctx.res, token);
    return { user };
  }

  // Credentials endpoint: tighter limit than the global default to blunt
  // password guessing.
  @Public()
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthPayload)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: { res: Response },
  ): Promise<AuthPayload> {
    const { user, token } = await this.authService.login(input);
    this.setAuthCookie(ctx.res, token);
    return { user };
  }

  @Public()
  @Mutation(() => Boolean)
  logout(@Context() ctx: { res: Response }): boolean {
    ctx.res.clearCookie(AUTH_COOKIE_NAME, {
      ...authCookieOptions(this.config.getOrThrow<string>('jwtExpiresIn')),
      maxAge: undefined,
    });
    return true;
  }

  @Query(() => User)
  me(@CurrentUser() current: AuthenticatedUser): Promise<User> {
    return this.authService.findUserById(current.userId);
  }

  private setAuthCookie(res: Response, token: string): void {
    const expiresIn = this.config.getOrThrow<string>('jwtExpiresIn');
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions(expiresIn));
  }
}
