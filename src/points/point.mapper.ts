import type { User } from 'generated/prisma';

export type PointResponse = Omit<
  User,
  'hashedPassword' | 'id' | 'createdAt' | 'updatedAt'
>;

export class PointMapper {
  static toResponse(point: User): PointResponse {
    return {
      name: point.name,
      login: point.login,
      balance: point.balance,
      isAdmin: point.isAdmin,
    };
  }
}
