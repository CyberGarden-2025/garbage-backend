import { ApiProperty } from '@nestjs/swagger';

export class CategorizeResponse {
  @ApiProperty({ example: 'Glass' })
  type: string;

  @ApiProperty({ example: 'unknown' })
  subtype: string;

  @ApiProperty({ example: 'clean' })
  state: string;

  @ApiProperty({ example: 'прошу помогите мне, меня держат в заложниках.' })
  text: string;

  @ApiProperty({ example: false })
  accepted: boolean;
}
