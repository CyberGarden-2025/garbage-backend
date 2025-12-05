import { AuthCredentials } from 'src/auth/guards/auth.guard';

declare global {
  namespace Express {
    interface Request {
      credentials?: AuthCredentials;
    }
  }
}
