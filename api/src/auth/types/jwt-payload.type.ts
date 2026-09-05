import type { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  orgId: string;
  role: UserRole;
}

/** Shape attached to the request by `JwtStrategy.validate`. */
export interface AuthenticatedUser {
  userId: string;
  orgId: string;
  role: UserRole;
}
