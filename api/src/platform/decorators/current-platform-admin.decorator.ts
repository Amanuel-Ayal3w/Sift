import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { PlatformAdmin } from '../types/platform-admin.type.js';

export const CurrentPlatformAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): PlatformAdmin => {
    const req = GqlExecutionContext.create(context).getContext().req;
    return req.platformAdmin;
  },
);
