import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class QuestSubjectResponse {
  @ApiPropertyOptional({ example: 'Plastic' })
  type?: string;

  @ApiPropertyOptional({ example: 'pet_container' })
  subtype?: string;
}

class QuestResponse {
  @ApiProperty({ example: 'daily_0_1733500800000' })
  id: string;

  @ApiProperty({ example: 7 })
  goal: number;

  @ApiProperty({ type: QuestSubjectResponse })
  subject: QuestSubjectResponse;

  @ApiProperty({ example: 100 })
  reward: number;

  @ApiProperty({ example: '2025-12-06T00:00:00.000Z' })
  createdAt: string;
}

class QuestProgressResponse {
  @ApiProperty({ type: QuestResponse })
  quest: QuestResponse;

  @ApiProperty({ example: 5 })
  progress: number;

  @ApiProperty({ example: false })
  completed: boolean;
}

export class AllQuestsResponse {
  @ApiProperty({ type: [QuestProgressResponse] })
  daily: QuestProgressResponse[];

  @ApiProperty({ type: QuestProgressResponse, nullable: true })
  weekly: QuestProgressResponse | null;
}
