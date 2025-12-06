import { Controller, Get, UseGuards } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AllQuestsResponse } from './swagger/quests.response';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all current quests (daily + weekly)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: AllQuestsResponse,
  })
  async getAllQuests() {
    const [daily, weekly] = await Promise.all([
      this.questsService.getCurrentDailyQuests(),
      this.questsService.getCurrentWeeklyQuest(),
    ]);

    return {
      daily,
      weekly,
    };
  }
}
