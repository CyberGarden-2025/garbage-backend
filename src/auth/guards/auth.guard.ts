import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export type AuthCredentials = {
  login: string;
  password: String;
};

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const credentials = this.extractCredentials(request);

    if (!credentials) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    request['credentials'] = credentials;

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
