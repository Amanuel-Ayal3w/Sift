import { Field, ObjectType } from '@nestjs/graphql';
import { PlatformAdmin } from './platform-admin.type.js';

/** The JWT is set as an httpOnly cookie and is never returned in the body. */
@ObjectType()
export class PlatformAuthPayload {
  @Field(() => PlatformAdmin)
  admin: PlatformAdmin;
}
