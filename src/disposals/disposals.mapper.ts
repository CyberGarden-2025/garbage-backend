import type { GarbageHistory } from 'generated/prisma';

export type DisposalResponse = Omit<GarbageHistory, 'userId'>;

export class DisposalsMapper {
  static toResponse(disposal: GarbageHistory): DisposalResponse {
    return {
      id: disposal.id,
      garbageType: disposal.garbageType,
      garbageSubtype: disposal.garbageSubtype,
      garbageState: disposal.garbageState,
      coinAmount: disposal.coinAmount,
      createdAt: disposal.createdAt,
    };
  }
}
