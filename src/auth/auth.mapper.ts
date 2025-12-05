import type { Point } from 'generated/prisma';

export type PointResponse = Omit<
  Point,
  'hashedPassword' | 'id' | 'createdAt' | 'updatedAt'
>;

export class AuthMapper {
  static toResponse(point: Point): PointResponse {
    return {
      name: point.name,
      login: point.login,
    };
  }
}
