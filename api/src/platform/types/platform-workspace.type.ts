import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BillingPlan } from '../../billing/billing-plan.enum.js';

@ObjectType()
export class PlatformWorkspace {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  ownerEmail: string | null;

  @Field(() => Int)
  userCount: number;

  @Field(() => Int)
  leadCount: number;

  @Field()
  gmailConnected: boolean;

  @Field(() => BillingPlan)
  plan: BillingPlan;

  @Field()
  suspended: boolean;

  @Field()
  createdAt: Date;
}
