import { Module } from '@nestjs/common';
import { PointsModule } from '../points/points.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaModule } from '../prisma/prisma.module';
import { CategorizeModule } from 'src/categorize/categorize.module';
import { DisposalsModule } from 'src/disposals/disposals.module';
import { QuestsModule } from 'src/quests/quests.module';
import { RedisModule } from 'src/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';

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
