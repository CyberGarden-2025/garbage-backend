import {
  GarbageType,
  GarbageSubtype,
} from '../../shared/constants/garbage.constants';

export type QuestSubject = {
  type?: GarbageType;
  subtype?: GarbageSubtype;
};

export type DailyQuest = {
  id: string;
  goal: number;
  subject: QuestSubject;
  reward: number;
  createdAt: string;
};

export type WeeklyQuest = {
  id: string;
  goal: number;
  subject: QuestSubject;
  reward: number;
  createdAt: string;
};

export type QuestProgress = {
  quest: DailyQuest | WeeklyQuest;
  progress: number;
  completed: boolean;
};

export type AllQuestsProgress = {
  daily: QuestProgress[];
  weekly: QuestProgress | null;
};
