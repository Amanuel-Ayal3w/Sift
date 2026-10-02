import { describe, expect, it } from 'vitest';
import { attachCookies } from '../auth/attach-cookies.js';
import type { IncomingMessage } from 'node:http';

function fakeReq(cookieHeader?: string) {
  return {
    headers: { cookie: cookieHeader },
  } as IncomingMessage & { cookies?: Record<string, string> };
}

describe('attachCookies', () => {
  it('parses the Cookie header onto req.cookies', () => {
    const req = fakeReq('sift_token=abc; other=1');
    attachCookies(req);
    expect(req.cookies).toEqual({ sift_token: 'abc', other: '1' });
  });

  it('leaves an empty object when there is no Cookie header', () => {
    const req = fakeReq();
    attachCookies(req);
    expect(req.cookies).toEqual({});
  });
});
