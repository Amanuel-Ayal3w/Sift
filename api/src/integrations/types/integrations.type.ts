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
}
