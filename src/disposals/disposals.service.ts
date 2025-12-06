import { Injectable, Logger } from '@nestjs/common';
import { CreateDisposalDto } from './dto/create-disposal.dto';
import { PrismaService } from '../prisma/prisma.service';
import { COINS } from 'src/shared/constants/coins.constants';
import { PointMapper } from 'src/point/point.mapper';
import { DisposalsMapper } from './disposals.mapper';

@Injectable()
export class DisposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDisposal(data: CreateDisposalDto) {
    Logger.log(
      `Recording disposal: ${JSON.stringify(data)}`,
      'DisposalsService',
    );

    const disposal = await this.prisma.garbageHistory.create({
      data: {
        userId: data.pointId,
        garbageType: data.type,
        garbageSubtype: data.subtype,
        garbageState: data.state,
        coinAmount: COINS.DISPOSAL_REWARD,
      },
    });

    const updatedPoint = await this.prisma.user.update({
      where: {
        id: disposal.userId,
      },
      data: {
        balance: {
          increment: COINS.DISPOSAL_REWARD,
        },
      },
    });

    return {
      disposal: DisposalsMapper.toResponse(disposal),
      point: PointMapper.toResponse(updatedPoint),
    };
  }
}
