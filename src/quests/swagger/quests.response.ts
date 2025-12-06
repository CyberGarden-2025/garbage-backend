import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class QuestSubjectResponse {
  @ApiPropertyOptional({ example: 'plastic' })
  type?: string;

  @ApiPropertyOptional({ example: 'bottles' })
  subtype?: string;
}

class QuestResponse {
  @ApiProperty({ example: 'daily_0_1733500800000' })
  id: string;

  @ApiProperty({ example: 7 })
  goal: number;

  @ApiProperty({ type: QuestSubjectResponse })
  subject: QuestSubjectResponse;

  @ApiProperty({ example: '2025-12-06T00:00:00.000Z' })
  createdAt: string;
}

export class AllQuestsResponse {
  @ApiProperty({ type: [QuestResponse] })
  daily: QuestResponse[];

  @ApiProperty({ type: QuestResponse, nullable: true })
  weekly: QuestResponse | null;
}
