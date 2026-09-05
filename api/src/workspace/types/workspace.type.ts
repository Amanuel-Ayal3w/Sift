import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Workspace {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  qualificationCriteria: string;

  @Field()
  productDescription: string;

  @Field(() => String, { nullable: true })
  replyTone: string | null;

  /** Where inbound leads should be POSTed. Derived, not stored. */
  @Field()
  webhookUrl: string;

  @Field()
  createdAt: Date;
}
