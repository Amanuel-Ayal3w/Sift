import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class IngestLeadDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyDomain?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  jobTitle?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10_000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;
}
