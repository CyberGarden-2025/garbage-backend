import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code: number;
    let error: string;

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        error = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const res = exceptionResponse as Record<string, any>;
        const message = res.message || res.error || 'Unknown error';

        if (Array.isArray(message)) {
          error = message.join(', ');
        } else {
          error = message;
        }
      } else {
        error = 'Unknown error';
      }
    } else {
      code = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal server error';
      Logger.error(`Unexpected error: ${exception}`, 'AllExceptionsFilter');
    }

    response.status(code).json({
      error,
      code,
    });
  }
}
