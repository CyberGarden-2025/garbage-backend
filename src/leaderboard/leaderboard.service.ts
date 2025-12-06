import { Injectable } from '@nestjs/common';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';
import { getDateFrom } from '@/shared/utils/date.utils';
import { PrismaService } from '@/prisma/prisma.service';
import { LeaderboardResponse } from './swagger/leaderboard.response';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(query: GetLeaderboardDto): Promise<LeaderboardResponse> {
    const { period, page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const dateFrom = getDateFrom(period);

    const leaderboardData = await this.prisma.garbageHistory.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: dateFrom },
      },
      _sum: {
        coinAmount: true,
      },
      orderBy: {
        _sum: {
          coinAmount: 'desc',
        },
      },
    });

    const total = leaderboardData.length;

    const paginatedData = leaderboardData.slice(skip, skip + limit);

    const userIds = paginatedData.map((item) => item.userId);

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const data = paginatedData.map((item, index) => ({
      userId: item.userId,
      name: userMap.get(item.userId) || 'Unknown',
      coins: item._sum.coinAmount || 0,
      rank: skip + index + 1,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      period,
    };
  }
}
