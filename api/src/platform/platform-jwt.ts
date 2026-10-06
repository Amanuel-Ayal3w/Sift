export interface PlatformJwtPayload {
  sub: string;
  email: string;
  kind: 'platform';
}
