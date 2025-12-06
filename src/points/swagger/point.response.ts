import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PointResponse {
  @ApiProperty({ example: 'Point Name' })
  name: string;

  @ApiProperty({ example: 'point_login' })
  login: string;

  @ApiProperty({ example: false })
  isAdmin: boolean;

  @ApiProperty({ example: 100 })
  balance: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'Score for selected period',
  })
  score?: number;
}

export class PaginatedPointResponse {
  @ApiProperty({ type: [PointResponse] })
  data: PointResponse[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
