import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateDisposalDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  pointId: string;

  @ApiProperty({ example: 'Plastic' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'pet_bottle' })
  @IsString()
  @IsNotEmpty()
  subtype: string;

  @ApiProperty({ example: 'dirty' })
  @IsString()
  @IsNotEmpty()
  state: string;
}
