import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlatformUser {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field(() => ID)
  workspaceId: string;

  @Field()
  workspaceName: string;

  @Field()
  createdAt: Date;
}
