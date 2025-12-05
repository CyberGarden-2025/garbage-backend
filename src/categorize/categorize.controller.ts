import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { CategorizeService } from './categorize.service';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategorizeResponse } from './swagger/categorize.response';

@Controller('categorize')
export class CategorizeController {
  constructor(private readonly categorizeService: CategorizeService) {}

  @Post('/')
  @ApiOperation({ summary: 'Categorize an item' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    type: CategorizeResponse,
  })
  @UseInterceptors(FileInterceptor('image'))
  async categorizeItem(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.categorizeService.categorizeImage(image);
  }
}
