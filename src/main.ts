import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptors';
import { AllExceptionsFilter } from './shared/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Garbage API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const port = configService.getOrThrow<number>('APPLICATION_PORT');

  const swaggerPath = configService.getOrThrow<string>('SWAGGER_PATH');
  const swaggerURL = configService.getOrThrow<string>('SWAGGER_URL');
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPath, app, documentFactory(), {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  });

  await app.listen(port ?? 4000);

  Logger.log(`Application successfully started on port: ${port}`, 'Main');
  Logger.log(`Swagger URL is: ${swaggerURL}:${port}/${swaggerPath}`, 'Main');
}
bootstrap();
