import { Module } from '@nestjs/common';
import { DisposalsService } from './disposals.service';
import { DisposalsController } from './disposals.controller';
import { QuestsService } from 'src/quests/quests.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestsModule } from 'src/quests/quests.module';

@Module({
  imports: [PrismaModule, QuestsModule],
  controllers: [DisposalsController],
  providers: [DisposalsService],
})
export class DisposalsModule {}
