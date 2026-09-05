import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

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
}
