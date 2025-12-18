import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ExperienceYears } from '../schema/experts.schema';

export class UserUpdateDto {
  @ApiPropertyOptional({ example: 'Ali' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Rezaei' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'ali@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'https://cdn.site/avatar.png' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  nationalId?: number;

  @ApiPropertyOptional({ example: ['backend', 'nestjs'] })
  @IsOptional()
  @IsString()
  domains?: string;

  @ApiPropertyOptional({ example: ['auth', 'payments'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subdomains?: string[];

  @ApiPropertyOptional({ example: ['Node.js', 'PostgreSQL'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ example: 'Senior backend developer' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['Payment system', 'Auth service'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sampleJob?: string[];

  @ApiPropertyOptional({ example: 'full-time' })
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiPropertyOptional({ example: ['https://linkedin.com/in/ali'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contactLinks?: string[];

  @ApiPropertyOptional({ example: ['09379534460'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contactNumbers?: string[];

  @ApiPropertyOptional({ enum: ExperienceYears, example: ExperienceYears.THREE_TO_FIVE_YEARS })
  @IsOptional()
  @IsEnum(ExperienceYears)
  yearsOfExperience?: ExperienceYears;

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  documents?: string[];

  @ApiPropertyOptional({ example: 'province' })
  @IsOptional()
  @IsString()
  province: string;

  @ApiPropertyOptional({ example: 'city' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional({ example: 'city' })
  @IsOptional()
  @IsString()
  location: string;
}
