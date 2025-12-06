import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsEnum, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ScoreFilter } from 'src/shared/enums/score-filter.enum';

export class GetAllPointsDto {
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

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Sort by name',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByName?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Filter by score',
    enum: ScoreFilter,
  })
  @IsOptional()
  @IsEnum(ScoreFilter)
  score?: ScoreFilter;

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort by score (requires score filter)',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByScore?: 'asc' | 'desc';
}
