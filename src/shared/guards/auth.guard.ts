import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePasswords } from '../utils/password.utils';

export type AuthCredentials = {
  login: string;
  password: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const credentials = this.extractCredentials(request);

    if (!credentials) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    Logger.log(`Authenticated user: ${credentials.login}`, 'AuthGuard');

    const user = await this.prisma.user.findUnique({
      where: { login: credentials.login },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePasswords(
      credentials.password,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    request['credentials'] = credentials;

    Logger.log(`Authorized user: ${credentials.login}`, 'AuthGuard');

    return true;
  }

  private extractCredentials(request: Request): AuthCredentials | null {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.slice(7);

    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');

      const [login, password] = decoded.split(':');

      if (!login || !password) {
        return null;
      }

      return { login, password };
    } catch {
      return null;
    }
  }
}
