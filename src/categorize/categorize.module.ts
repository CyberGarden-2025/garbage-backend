import { Module } from '@nestjs/common';
import { CategorizeService } from './categorize.service';
import { CategorizeController } from './categorize.controller';

@Module({
  controllers: [CategorizeController],
  providers: [CategorizeService],
})
export class CategorizeModule {}
