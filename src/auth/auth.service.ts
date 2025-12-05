import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/shared/utils/password.utils';
import { AuthMapper } from './auth.mapper';
import type { PointResponse } from './auth.mapper';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(data: RegisterDto): Promise<PointResponse> {
    const { name, login, password } = data;

    Logger.log(`Registering point: ${name}, login: ${login}`, 'AuthService');

    const existingPoint = await this.prismaService.point.findUnique({
      where: { login },
    });

    if (existingPoint) {
      throw new ConflictException('Point already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newPoint = await this.prismaService.point.create({
      data: {
        name,
        login,
        hashedPassword: hashedPassword,
      },
    });

    return AuthMapper.toResponse(newPoint);
  }
}
