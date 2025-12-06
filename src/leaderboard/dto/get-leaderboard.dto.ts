import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ScoreFilter } from '@/shared/enums/score-filter.enum';

export class GetLeaderboardDto {
  @ApiProperty({
    enum: ScoreFilter,
    description: 'Period filter',
    example: ScoreFilter.DAILY,
  })
  @IsEnum(ScoreFilter)
  period: ScoreFilter;

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
