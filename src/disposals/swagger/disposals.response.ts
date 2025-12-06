import { ApiProperty } from '@nestjs/swagger';

class DisposalData {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Plastic' })
  garbageType: string;

  @ApiProperty({ example: 'pet_bottle' })
  garbageSubtype: string;

  @ApiProperty({ example: 'dirty' })
  garbageState: string;

  @ApiProperty({ example: 10 })
  coinAmount: number;

  @ApiProperty({ example: '2025-12-06T12:00:00.000Z' })
  createdAt: Date;
}

class UserData {
  @ApiProperty({ example: 'Point Name' })
  name: string;

  @ApiProperty({ example: 'point_login' })
  login: string;

  @ApiProperty({ example: false })
  isAdmin: boolean;

  @ApiProperty({ example: 100 })
  balance: number;
}

export class DisposalResponse {
  @ApiProperty({ type: DisposalData })
  disposal: DisposalData;

  @ApiProperty({ type: UserData })
  user: UserData;
}
