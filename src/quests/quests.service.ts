import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  DailyQuest,
  WeeklyQuest,
  QuestProgress,
  QuestSubject,
  AllQuestsProgress,
} from './types/quest.types';
import {
  GARBAGE_SUBTYPES,
  GARBAGE_TYPES,
  QUEST_GOAL,
  QUEST_KEYS,
} from '../shared/constants/garbage.constants';
import { COINS } from '../shared/constants/coins.constants';
import { toSeconds } from 'src/shared/utils/ms.utils';

const DAILY_QUEST_COUNT = 3;

@Injectable()
export class QuestsService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyQuests(): Promise<DailyQuest[]> {
    Logger.log('Generating new daily quests...', 'QuestsService');

    await this.resetDailyProgress();

    const quests: DailyQuest[] = [];

    for (let i = 0; i < DAILY_QUEST_COUNT; i++) {
      const quest = this.createRandomDailyQuest(i);
      quests.push(quest);
    }

    await this.redis.set(
      QUEST_KEYS.DAILY_CONFIG,
      JSON.stringify(quests),
      toSeconds('1d'),
    );

    Logger.log(
      `New daily quests created: ${JSON.stringify(quests)}`,
      'QuestsService',
    );

    return quests;
  }

  async getCurrentDailyQuests(): Promise<DailyQuest[]> {
    const questsStr = await this.redis.get(QUEST_KEYS.DAILY_CONFIG);

    if (!questsStr) {
      return await this.generateDailyQuests();
    }

    return JSON.parse(questsStr);
  }

  async getDailyQuestsProgress(pointId: string): Promise<QuestProgress[]> {
    const quests = await this.getCurrentDailyQuests();

    const progressList: QuestProgress[] = [];

    for (const quest of quests) {
      const progressStr = await this.redis.get(
        QUEST_KEYS.DAILY_PROGRESS(pointId, quest.id),
      );
      const progress = progressStr ? parseInt(progressStr, 10) : 0;
      const completed = progress >= quest.goal;

      progressList.push({
        quest,
        progress,
        completed,
      });
    }

    return progressList;
  }

  private async resetDailyProgress(): Promise<void> {
    await this.redis.delByPattern('quests:daily:*:progress:*');
    await this.redis.delByPattern('quests:daily:*:completed:*');
    Logger.log('All daily quest progress reset', 'QuestsService');
  }

  private createRandomDailyQuest(index: number): DailyQuest {
    const goal = this.randomInt(QUEST_GOAL.DAILY.MIN, QUEST_GOAL.DAILY.MAX);
    const useType = Math.random() > 0.3;

    const subject: QuestSubject = useType
      ? { type: GARBAGE_TYPES[this.randomInt(0, GARBAGE_TYPES.length - 1)] }
      : {
          subtype:
            GARBAGE_SUBTYPES[this.randomInt(0, GARBAGE_SUBTYPES.length - 1)],
        };

    return {
      id: `daily_${index}_${Date.now()}`,
      goal,
      subject,
      createdAt: new Date().toISOString(),
    };
  }

  @Cron(CronExpression.EVERY_WEEK)
  async generateWeeklyQuest(): Promise<WeeklyQuest> {
    Logger.log('Generating new weekly quest...', 'QuestsService');

    await this.resetWeeklyProgress();

    const quest = this.createRandomWeeklyQuest();

    await this.redis.set(
      QUEST_KEYS.WEEKLY_CONFIG,
      JSON.stringify(quest),
      toSeconds('1w'),
    );

    Logger.log(
      `New weekly quest created: ${JSON.stringify(quest)}`,
      'QuestsService',
    );

    return quest;
  }

  async getCurrentWeeklyQuest(): Promise<WeeklyQuest | null> {
    const questStr = await this.redis.get(QUEST_KEYS.WEEKLY_CONFIG);

    if (!questStr) {
      return await this.generateWeeklyQuest();
    }

    return JSON.parse(questStr);
  }

  async getWeeklyQuestProgress(pointId: string): Promise<QuestProgress | null> {
    const quest = await this.getCurrentWeeklyQuest();

    if (!quest) {
      return null;
    }

    const progressStr = await this.redis.get(
      QUEST_KEYS.WEEKLY_PROGRESS(pointId),
    );
    const progress = progressStr ? parseInt(progressStr, 10) : 0;
    const completed = progress >= quest.goal;

    return {
      quest,
      progress,
      completed,
    };
  }

  private async resetWeeklyProgress(): Promise<void> {
    await this.redis.delByPattern('quests:weekly:*:progress');
    await this.redis.delByPattern('quests:weekly:*:completed');
    Logger.log('All weekly quest progress reset', 'QuestsService');
  }

  private createRandomWeeklyQuest(): WeeklyQuest {
    const goal = this.randomInt(QUEST_GOAL.WEEKLY.MIN, QUEST_GOAL.WEEKLY.MAX);

    const subject: QuestSubject = {
      type: GARBAGE_TYPES[this.randomInt(0, GARBAGE_TYPES.length - 1)],
      subtype: GARBAGE_SUBTYPES[this.randomInt(0, GARBAGE_SUBTYPES.length - 1)],
    };

    return {
      id: `weekly_${Date.now()}`,
      goal,
      subject,
      createdAt: new Date().toISOString(),
    };
  }

  async getAllQuestsProgress(pointId: string): Promise<AllQuestsProgress> {
    const [daily, weekly] = await Promise.all([
      this.getDailyQuestsProgress(pointId),
      this.getWeeklyQuestProgress(pointId),
    ]);

    return {
      daily,
      weekly,
    };
  }

  async updateProgress(
    pointId: string,
    garbageType: string,
    garbageSubtype: string,
  ) {
    const [dailyResults, weeklyResult] = await Promise.all([
      this.updateDailyProgress(pointId, garbageType, garbageSubtype),
      this.updateWeeklyProgress(pointId, garbageType, garbageSubtype),
    ]);

    return {
      daily: dailyResults,
      weekly: weeklyResult,
    };
  }

  private async updateDailyProgress(
    pointId: string,
    garbageType: string,
    garbageSubtype: string,
  ) {
    const quests = await this.getCurrentDailyQuests();
    const results: Array<{
      questId: string;
      matched: boolean;
      progress: number;
      completed: boolean;
      reward?: number;
    }> = [];

    for (const quest of quests) {
      const completedStr = await this.redis.get(
        QUEST_KEYS.DAILY_COMPLETED(pointId, quest.id),
      );

      if (completedStr === 'true') {
        const progressStr = await this.redis.get(
          QUEST_KEYS.DAILY_PROGRESS(pointId, quest.id),
        );
        results.push({
          questId: quest.id,
          matched: false,
          progress: parseInt(progressStr || '0', 10),
          completed: true,
        });
        continue;
      }

      const matched = this.isGarbageMatching(
        quest.subject,
        garbageType,
        garbageSubtype,
      );

      if (!matched) {
        const progressStr = await this.redis.get(
          QUEST_KEYS.DAILY_PROGRESS(pointId, quest.id),
        );
        results.push({
          questId: quest.id,
          matched: false,
          progress: parseInt(progressStr || '0', 10),
          completed: false,
        });
        continue;
      }

      const newProgress = await this.redis.incr(
        QUEST_KEYS.DAILY_PROGRESS(pointId, quest.id),
      );
      const completed = newProgress >= quest.goal;

      let reward: number | undefined;

      if (completed && newProgress === quest.goal) {
        await this.redis.set(
          QUEST_KEYS.DAILY_COMPLETED(pointId, quest.id),
          'true',
          toSeconds('1d'),
        );

        await this.prisma.user.update({
          where: { id: pointId },
          data: {
            balance: { increment: COINS.DAILY_QUEST_REWARD },
          },
        });

        reward = COINS.DAILY_QUEST_REWARD;
        Logger.log(
          `Point ${pointId} completed daily quest ${quest.id}! Reward: ${reward}`,
          'QuestsService',
        );
      }

      results.push({
        questId: quest.id,
        matched: true,
        progress: newProgress,
        completed,
        reward,
      });
    }

    return results;
  }

  private async updateWeeklyProgress(
    pointId: string,
    garbageType: string,
    garbageSubtype: string,
  ) {
    const quest = await this.getCurrentWeeklyQuest();

    if (!quest) {
      return null;
    }

    const completedStr = await this.redis.get(
      QUEST_KEYS.WEEKLY_COMPLETED(pointId),
    );

    if (completedStr === 'true') {
      const progressStr = await this.redis.get(
        QUEST_KEYS.WEEKLY_PROGRESS(pointId),
      );
      return {
        questId: quest.id,
        matched: false,
        progress: parseInt(progressStr || '0', 10),
        completed: true,
      };
    }

    const matched = this.isGarbageMatching(
      quest.subject,
      garbageType,
      garbageSubtype,
    );

    if (!matched) {
      const progressStr = await this.redis.get(
        QUEST_KEYS.WEEKLY_PROGRESS(pointId),
      );
      return {
        questId: quest.id,
        matched: false,
        progress: parseInt(progressStr || '0', 10),
        completed: false,
      };
    }

    const newProgress = await this.redis.incr(
      QUEST_KEYS.WEEKLY_PROGRESS(pointId),
    );
    const completed = newProgress >= quest.goal;

    let reward: number | undefined;

    if (completed && newProgress === quest.goal) {
      await this.redis.set(
        QUEST_KEYS.WEEKLY_COMPLETED(pointId),
        'true',
        toSeconds('1w'),
      );

      await this.prisma.user.update({
        where: { id: pointId },
        data: {
          balance: { increment: COINS.WEEKLY_QUEST_REWARD },
        },
      });

      reward = COINS.WEEKLY_QUEST_REWARD;
      Logger.log(
        `Point ${pointId} completed weekly quest! Reward: ${reward}`,
        'QuestsService',
      );
    }

    return {
      questId: quest.id,
      matched: true,
      progress: newProgress,
      completed,
      reward,
    };
  }

  private isGarbageMatching(
    subject: QuestSubject,
    garbageType: string,
    garbageSubtype: string,
  ): boolean {
    if (subject.type && subject.subtype) {
      return subject.type === garbageType && subject.subtype === garbageSubtype;
    }

    if (subject.type) {
      return subject.type === garbageType;
    }

    if (subject.subtype) {
      return subject.subtype === garbageSubtype;
    }

    return false;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
