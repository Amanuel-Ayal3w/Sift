import { parseCookie } from 'cookie';
import type { IncomingMessage } from 'node:http';

/** Parses a Cookie header onto `req.cookies` so the JWT strategy can read it. */
export function attachCookies(
  req: IncomingMessage & { cookies?: Record<string, string | undefined> },
): void {
  if (req.cookies) {
    return;
  }
  req.cookies = parseCookie(req.headers.cookie ?? '');
}
