export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  redisUrl: string;
  agentServiceUrl: string;
  publicApiUrl: string;
  webAppUrl: string;
}

/**
 * Single place where `process.env` is read. Everything else pulls values off
 * `ConfigService` so misconfiguration surfaces here rather than at call sites.
 */
export const configuration = (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  agentServiceUrl: process.env.AGENT_SERVICE_URL ?? 'http://localhost:8000',
  publicApiUrl: process.env.PUBLIC_API_URL ?? 'http://localhost:3001',
  webAppUrl: process.env.WEB_APP_URL ?? 'http://localhost:3000',
});
