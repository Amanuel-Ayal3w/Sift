import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * The stock ThrottlerGuard reads req/res off the HTTP context, which is empty
 * for GraphQL operations. This pulls them from the GraphQL context instead so
 * rate limiting covers both transports.
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    if (context.getType<'graphql'>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      return { req: ctx.req, res: ctx.res };
    }
    const http = context.switchToHttp();
    return { req: http.getRequest(), res: http.getResponse() };
  }
}
