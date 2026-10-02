import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Channel {
  @Field()
  name: string;

  @Field()
  status: string;
}

@ObjectType()
export class IntegrationsPayload {
  @Field()
  webhookUrl: string;

  @Field(() => [Channel])
  channels: Channel[];

  /** Gmail address that receives leads and sends replies, when configured. */
  @Field(() => String, { nullable: true })
  mailboxAddress: string | null;

  @Field()
  repliesEnabled: boolean;

  @Field()
  inboxConnected: boolean;
}
