import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsPhoneNumber('IR', { message: 'Invalid phone number' })
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;
}
