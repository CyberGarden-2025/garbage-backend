import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardItemResponse {
  @ApiProperty({ example: 'uuid-123' })
  userId: string;

  @ApiProperty({ example: 'Точка на Ленина' })
  name: string;

  @ApiProperty({ example: 150 })
  coins: number;

  @ApiProperty({ example: 1 })
  rank: number;
}

export class LeaderboardResponse {
  @ApiProperty({ type: [LeaderboardItemResponse] })
  data: LeaderboardItemResponse[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 'daily' })
  period: string;
}
