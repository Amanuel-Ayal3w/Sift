import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import type { IncomingMessage } from 'node:http';
import { join } from 'node:path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { attachCookies } from './auth/attach-cookies.js';
import { AuthModule } from './auth/auth.module.js';
import { GqlAuthGuard } from './auth/guards/gql-auth.guard.js';
import { GqlThrottlerGuard } from './auth/guards/gql-throttler.guard.js';
import { configuration } from './config/configuration.js';
import { IntegrationsModule } from './integrations/integrations.module.js';
import { LeadsModule } from './leads/leads.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { QueueModule } from './queue/queue.module.js';
import { WebhooksModule } from './webhooks/webhooks.module.js';
import { WorkspaceModule } from './workspace/workspace.module.js';

const isProduction = process.env.NODE_ENV === 'production';

type GraphqlContextSource = {
  req?: IncomingMessage & { cookies?: Record<string, string> };
  res?: unknown;
  extra?: { request: IncomingMessage & { cookies?: Record<string, string> } };
};

function graphqlContext(raw: GraphqlContextSource) {
  const req = raw.req ?? raw.extra?.request;
  if (req) {
    attachCookies(req);
  }
  return {
    req,
    res: raw.res ?? { header: () => undefined },
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // Resolvers need `res` to set the auth cookie and `req` to read it.
      // Subscriptions reuse the upgrade request; cookies are parsed onto it.
      context: graphqlContext,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
      },
      graphiql: !isProduction,
      introspection: !isProduction,
    }),
    PrismaModule,
    AuthModule,
    WorkspaceModule,
    LeadsModule,
    IntegrationsModule,
    QueueModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: GqlAuthGuard },
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
  ],
})
export class AppModule {}
