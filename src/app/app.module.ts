import { Module } from '@nestjs/common';
import { AuthModule } from '../point/point.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
