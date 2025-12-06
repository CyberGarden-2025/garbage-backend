import { Module } from '@nestjs/common';
import { PointsModule } from '../points/points.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { ScheduleModule } from '@nestjs/schedule';
import { CategorizeModule } from '@/categorize/categorize.module';
import { DisposalsModule } from '@/disposals/disposals.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { QuestsModule } from '@/quests/quests.module';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports: [
    PointsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    PrismaModule,
    CategorizeModule,
    DisposalsModule,
    QuestsModule,
    RedisModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
