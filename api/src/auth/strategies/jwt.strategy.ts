import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AUTH_COOKIE_NAME } from '../auth.cookie.js';
import type { AuthenticatedUser, JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // The token lives in an httpOnly cookie, not an Authorization header.
      jwtFromRequest: (req: Request) => req?.cookies?.[AUTH_COOKIE_NAME] ?? null,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('jwtSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload?.sub || !payload.orgId) {
      throw new UnauthorizedException();
    }
    const org = await this.prisma.organization.findUnique({
      where: { id: payload.orgId },
      select: { suspendedAt: true },
    });
    if (!org || org.suspendedAt) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, orgId: payload.orgId, role: payload.role };
  }
}
