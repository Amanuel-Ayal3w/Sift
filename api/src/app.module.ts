import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'node:path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // Resolvers need `res` to set the auth cookie and `req` to read it.
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
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
