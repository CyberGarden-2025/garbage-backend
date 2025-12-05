import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Min } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Username for the new point',
    example: 'office_1',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: 'login for the new point',
    example: 'office_1_login',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  login: string;

  @ApiProperty({
    description: 'password for the new point',
    example: 'office_1_password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
