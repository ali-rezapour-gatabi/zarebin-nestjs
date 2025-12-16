import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsBoolean, IsArray, IsOptional, IsEnum } from 'class-validator';
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

  @ApiPropertyOptional({ example: '2025-01-01T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @ApiPropertyOptional({ example: 1234567890 })
  @IsOptional()
  @IsNumber()
  nationalId?: number;

  @ApiPropertyOptional({ example: ['backend', 'nestjs'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domains?: string[];

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
  bio?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional({ example: ['cv.pdf', 'id.png'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @ApiPropertyOptional({ example: ['011-32450', '09379534460'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contacts?: string[];

  @ApiPropertyOptional({ enum: ExperienceYears, example: ExperienceYears.THREE_TO_FIVE_YEARS })
  @IsOptional()
  @IsEnum(ExperienceYears)
  experienceYears?: ExperienceYears;
}
