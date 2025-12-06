import { ScoreFilter } from '../enums/score-filter.enum';

export const getDateFrom = (score: ScoreFilter): Date => {
  const now = new Date();

  switch (score) {
    case ScoreFilter.DAILY:
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case ScoreFilter.WEEK:
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    case ScoreFilter.MONTH:
      return new Date(now.getFullYear(), now.getMonth(), 1);
    default:
      return new Date(0);
  }
};
