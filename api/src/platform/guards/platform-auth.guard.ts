import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PLATFORM_AUTH_COOKIE_NAME } from '../../auth/auth.cookie.js';
import { PlatformService } from '../platform.service.js';
import type { PlatformJwtPayload } from '../platform-jwt.js';

@Injectable()
export class PlatformAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly platform: PlatformService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = GqlExecutionContext.create(context).getContext().req as {
      cookies?: Record<string, string | undefined>;
      platformAdmin?: unknown;
    };
    const token = req?.cookies?.[PLATFORM_AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedException('Platform admin session required');
    }

    let payload: PlatformJwtPayload;
    try {
      payload = this.jwt.verify<PlatformJwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Platform admin session required');
    }
    if (payload.kind !== 'platform' || !payload.sub) {
      throw new UnauthorizedException('Platform admin session required');
    }

    const admin = await this.platform.findById(payload.sub);
    if (!admin) {
      throw new UnauthorizedException('Platform admin session required');
    }
    req.platformAdmin = admin;
    return true;
  }
}
