import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BillingPlan } from '../../billing/billing-plan.enum.js';

@ObjectType()
export class PlatformDay {
  @Field()
  date: string;

  @Field(() => Int)
  leads: number;

  @Field(() => Int)
  hotLeads: number;

  @Field(() => Int)
  warmLeads: number;

  @Field(() => Int)
  coldLeads: number;

  @Field(() => Int)
  workspaces: number;

  @Field(() => Int)
  users: number;
}

@ObjectType()
export class PlatformPlanStat {
  @Field(() => BillingPlan)
  plan: BillingPlan;

  @Field(() => Int)
  workspaces: number;

  @Field(() => Int)
  monthlyRevenue: number;
}

@ObjectType()
export class PlatformMetrics {
  @Field(() => Int)
  mrr: number;

  @Field(() => Int)
  arr: number;

  @Field(() => Int)
  payingWorkspaces: number;

  @Field(() => Int)
  trialWorkspaces: number;

  @Field(() => Int)
  averageScore: number;

  @Field(() => Int)
  mailboxCount: number;

  @Field(() => [PlatformPlanStat])
  plans: PlatformPlanStat[];

  @Field(() => [PlatformDay])
  days: PlatformDay[];
}
