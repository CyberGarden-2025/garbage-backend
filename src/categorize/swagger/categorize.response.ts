import { ApiProperty } from '@nestjs/swagger';

export class CategorizeResponse {
  @ApiProperty({ example: 'Glass' })
  type: string;

  @ApiProperty({ example: 'unknown' })
  subtype: string;

  @ApiProperty({ example: 'clean' })
  state: string;
}
