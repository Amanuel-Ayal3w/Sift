import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LeadStatus, LeadTier } from '@prisma/client';

registerEnumType(LeadTier, { name: 'LeadTier' });
registerEnumType(LeadStatus, { name: 'LeadStatus' });

@ObjectType()
export class Lead {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  company: string | null;

  @Field(() => String, { nullable: true })
  source: string | null;

  @Field(() => Int)
  score: number;

  @Field(() => LeadTier)
  tier: LeadTier;

  @Field(() => LeadStatus)
  status: LeadStatus;

  @Field()
  reasoning: string;

  @Field()
  draftReply: string;

  @Field(() => [String])
  keySignals: string[];

  /**
   * Raw timestamp rather than a formatted "2m ago" string — relative time is
   * a rendering concern and would go stale the moment it is serialized.
   */
  @Field()
  createdAt: Date;
}
