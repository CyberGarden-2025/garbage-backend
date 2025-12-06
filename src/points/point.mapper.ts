import type { User } from 'generated/prisma';

export type PointResponse = Omit<
  User,
  'hashedPassword' | 'createdAt' | 'updatedAt'
>;

export class PointMapper {
  static toResponse(point: User): PointResponse {
    return {
      id: point.id,
      name: point.name,
      login: point.login,
      balance: point.balance,
      isAdmin: point.isAdmin,
    };
  }
}
