import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AUTH_COOKIE_NAME } from '../auth.cookie.js';
import type { AuthenticatedUser, JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // The token lives in an httpOnly cookie, not an Authorization header.
      jwtFromRequest: (req: Request) => req?.cookies?.[AUTH_COOKIE_NAME] ?? null,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('jwtSecret'),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { userId: payload.sub, orgId: payload.orgId, role: payload.role };
  }
}
