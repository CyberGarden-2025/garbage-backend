import { Module } from '@nestjs/common';
import { PointModule } from '../point/point.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaModule } from '../prisma/prisma.module';
import { CategorizeModule } from 'src/categorize/categorize.module';

@Module({
  imports: [
    PointModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    PrismaModule,
    CategorizeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
