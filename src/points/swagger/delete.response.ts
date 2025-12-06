import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponse {
  @ApiProperty({ example: 'Point deleted successfully' })
  message: string;
}
