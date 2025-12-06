import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdatePointDto {
  @ApiPropertyOptional({ example: 'New Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'new_login' })
  @IsString()
  @IsOptional()
  login?: string;

  @ApiPropertyOptional({ example: 'newPassword123' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(40)
  password?: string;
}
