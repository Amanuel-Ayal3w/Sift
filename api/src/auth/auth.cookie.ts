import type { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'sift_token';

const UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/** Converts a JWT-style duration ("7d", "12h", "3600") to milliseconds. */
export function durationToMs(duration: string): number {
  const match = /^(\d+)([smhd])?$/.exec(duration.trim());
  if (!match) {
    throw new Error(`Unsupported JWT_EXPIRES_IN value: "${duration}"`);
  }
  const [, amount, unit] = match;
  return Number(amount) * (unit ? UNIT_MS[unit] : 1000);
}

export function authCookieOptions(expiresIn: string): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: durationToMs(expiresIn),
  };
}
