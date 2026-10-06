import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlatformAdmin {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}
