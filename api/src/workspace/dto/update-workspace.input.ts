import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Covers both the Settings page (name) and the Criteria page
 * (qualificationCriteria) — every field is optional and only the provided
 * ones are written.
 */
@InputType()
export class UpdateWorkspaceInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  qualificationCriteria?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5_000)
  productDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  replyTone?: string;
}
