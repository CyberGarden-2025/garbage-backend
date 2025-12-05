import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePointDto } from './dto/create.dto';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/shared/utils/password.utils';
import { PointMapper } from './point.mapper';
import { PointResponse } from './point.mapper';
import type { UpdatePointDto } from './dto/update.dto';
import { GetAllPointsDto } from './dto/get-all-points.dto';
import { PaginatedPointResponse } from './swagger/point.response';

@Injectable()
export class PointService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreatePointDto): Promise<PointResponse> {
    const { name, login, password } = data;

    Logger.log(`Creating point: ${name}, login: ${login}`, 'PointService');

    const existingPoint = await this.prismaService.user.findUnique({
      where: { login },
    });

    if (existingPoint) {
      throw new ConflictException('Point already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newPoint = await this.prismaService.user.create({
      data: {
        name,
        login,
        hashedPassword: hashedPassword,
      },
    });
    Logger.log(`Created point: ${name}, login: ${login}`, 'PointService');

    return PointMapper.toResponse(newPoint);
  }

  async getPointById(id: string): Promise<PointResponse> {
    const point = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!point) {
      throw new NotFoundException('Point not found');
    }

    Logger.log(`Retrieved point with id: ${id}`, 'PointService');

    return PointMapper.toResponse(point);
  }

  async deletePointById(id: string): Promise<Record<string, string>> {
    const point = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!point) {
      throw new NotFoundException('Point not found');
    }

    await this.prismaService.user.delete({
      where: { id },
    });

    Logger.log(`Deleted point with id: ${id}`, 'PointService');

    return {
      message: 'Point deleted successfully',
    };
  }

  async updatePointById(
    id: string,
    data: UpdatePointDto,
  ): Promise<PointResponse> {
    const point = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!point) {
      throw new NotFoundException('Point not found');
    }

    const updatePoint: any = {};

    if (data.name) {
      updatePoint.name = data.name;
    }

    if (data.login) {
      updatePoint.login = data.login;
    }

    if (data.password) {
      updatePoint.hashedPassword = await hashPassword(data.password);
    }

    const updatedPoint = await this.prismaService.user.update({
      where: { id },
      data: updatePoint,
    });

    Logger.log(`Updated point with id: ${id}`, 'PointService');

    return PointMapper.toResponse(updatedPoint);
  }

  async getAllPoints(query: GetAllPointsDto): Promise<PaginatedPointResponse> {
    const { page = 1, limit = 10, sortByName, score } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    const orderBy: any = {};

    if (sortByName) {
      orderBy.name = sortByName;
    }

    const [data, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        orderBy: Object.keys(orderBy).length ? orderBy : undefined,
        skip,
        take: limit,
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      data: data.map(PointMapper.toResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
