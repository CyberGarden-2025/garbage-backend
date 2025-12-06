import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';
import { LeaderboardResponse } from './swagger/leaderboard.response';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get the leaderboard' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: LeaderboardResponse })
  async getLeaderboard(@Query() query: GetLeaderboardDto) {
    return this.leaderboardService.getLeaderboard(query);
  }
}
