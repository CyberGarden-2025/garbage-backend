import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { QuestsService } from './quests.service';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AllQuestsResponse } from './swagger/quests.response';
import { AuthGuard } from '@/shared/guards/auth.guard';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all current quests (daily + weekly)' })
  @ApiQuery({
    name: 'pointId',
    required: true,
    description: 'Point ID to get progress for',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: AllQuestsResponse,
  })
  async getAllQuests(@Query('pointId') pointId: string) {
    return this.questsService.getAllQuestsProgress(pointId);
  }
}
