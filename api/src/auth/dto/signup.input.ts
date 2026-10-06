import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BillingPlan } from '../../billing/billing-plan.enum.js';

@InputType()
export class SignupInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  companyName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  password: string;

  @Field(() => BillingPlan, { nullable: true })
  @IsOptional()
  @IsEnum(BillingPlan)
  plan?: BillingPlan;
}
