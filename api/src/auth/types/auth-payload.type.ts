import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.type.js';

/**
 * The JWT itself is never returned in the body — it is set as an httpOnly
 * cookie so it stays out of reach of client-side JavaScript.
 */
@ObjectType()
export class AuthPayload {
  @Field(() => User)
  user: User;
}
