import { AuthCredentials } from 'src/shared/guards/auth.guard';

declare global {
  namespace Express {
    interface Request {
      credentials?: AuthCredentials;
    }
  }
}
