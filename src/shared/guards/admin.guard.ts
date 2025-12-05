import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const credentials = request.credentials;

    const { login } = credentials;

    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user?.isAdmin) {
      throw new UnauthorizedException('Admin privileges required');
    }

    return true;
  }
}
