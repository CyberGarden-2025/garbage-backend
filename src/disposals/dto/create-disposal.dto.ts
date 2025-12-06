import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsIn } from 'class-validator';
import {
  GARBAGE_STATES,
  GARBAGE_SUBTYPES,
  GARBAGE_TYPES,
} from 'src/shared/constants/garbage.constants';

export class CreateDisposalDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  pointId: string;

  @ApiProperty({ example: 'Plastic' })
  @IsString()
  @IsNotEmpty()
  @IsIn(GARBAGE_TYPES)
  type: string;

  @ApiProperty({ example: 'pet_bottle' })
  @IsString()
  @IsIn(GARBAGE_SUBTYPES)
  @IsNotEmpty()
  subtype: string;

  @ApiProperty({ example: 'dirty' })
  @IsString()
  @IsIn(GARBAGE_STATES)
  @IsNotEmpty()
  state: string;
}
