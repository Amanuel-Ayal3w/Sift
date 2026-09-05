import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Opts a resolver or route out of the globally registered auth guard. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
