import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlatformOverview {
  @Field(() => Int)
  workspaceCount: number;

  @Field(() => Int)
  userCount: number;

  @Field(() => Int)
  leadCount: number;

  @Field(() => Int)
  suspendedWorkspaceCount: number;

  @Field(() => Int)
  hotLeads: number;

  @Field(() => Int)
  warmLeads: number;

  @Field(() => Int)
  coldLeads: number;

  @Field(() => Int)
  newLeads: number;

  @Field(() => Int)
  reviewedLeads: number;

  @Field(() => Int)
  contactedLeads: number;

  @Field(() => Int)
  archivedLeads: number;
}
