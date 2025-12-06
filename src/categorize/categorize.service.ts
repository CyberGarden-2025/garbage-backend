import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategorizeService {
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.apiUrl = this.configService.getOrThrow<string>('ML_API_URL');
  }

  async categorizeImage(image: Express.Multer.File) {
    Logger.log(
      `Sending image: ${image.originalname} to ML API`,
      'CategorizeService',
    );

    const formData = new FormData();
    const uint8Array = new Uint8Array(image.buffer);
    const blob = new Blob([uint8Array], { type: image.mimetype });
    formData.append('file', blob, image.originalname);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.status !== 200) {
        throw new HttpException(
          `ML API error: ${response.statusText}`,
          response.status,
        );
      }

      const result = await response.json();

      Logger.log(`Task completed`, 'CategorizeService');

      const adviceData = await this.prismaService.advice.findUnique({
        where: {
          garbageType_garbageSubtype_garbageState: {
            garbageType: result.items[0].type,
            garbageSubtype: result.items[0].subtype,
            garbageState: result.items[0].state,
          },
        },
      });

      if (adviceData) {
        result.items[0].text = adviceData.text;
        result.items[0].accepted = adviceData.accepted;
      }

      return result.items[0];
    } catch (error) {
      Logger.error(`ML API error: ${error.message}`, 'CategorizeService');
      throw new HttpException('Failed to categorize image', 500);
    }
  }
}
