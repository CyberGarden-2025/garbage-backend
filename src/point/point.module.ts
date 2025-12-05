import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PointController],
  providers: [PointService],
})
export class PointModule {}
