import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategorizeService {
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
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

      if (!response.ok) {
        throw new HttpException(
          `ML API error: ${response.statusText}`,
          response.status,
        );
      }

      const result = (await response.json()) as { task_id: string };

      const taskId = result.task_id;

      console.log(taskId);

      if (!taskId) {
        throw new HttpException('No task_id received', 500);
      }

      Logger.log(`Task created: ${taskId}`, 'CategorizeService');

      return await this.waitForResult(Number(taskId));
    } catch (error) {
      Logger.error(`ML API error: ${error.message}`, 'CategorizeService');
      throw new HttpException('Failed to categorize image', 500);
    }
  }

  private async waitForResult(
    taskId: number,
    maxAttempts = 100,
    delayMs = 1000,
  ) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      Logger.log(
        `Polling attempt ${attempt}/${maxAttempts} for task ${taskId}`,
        'CategorizeService',
      );

      const response = await fetch(`${this.apiUrl}${taskId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new HttpException(
          `ML API error: ${response.statusText}`,
          response.status,
        );
      }

      const result = await response.json();

      if (result.status === 'DONE') {
        Logger.log(`Task ${taskId} completed`, 'CategorizeService');
        return result.result.items[0];
      }

      await this.sleep(delayMs);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
