export const QUEST_KEYS = {
  DAILY_CONFIG: 'quests:daily:config',
  DAILY_PROGRESS: (pointId: string, questId: string) =>
    `quests:daily:${pointId}:progress:${questId}`,
  DAILY_COMPLETED: (pointId: string, questId: string) =>
    `quests:daily:${pointId}:completed:${questId}`,

  WEEKLY_CONFIG: 'quests:weekly:config',
  WEEKLY_PROGRESS: (pointId: string) => `quests:weekly:${pointId}:progress`,
  WEEKLY_COMPLETED: (pointId: string) => `quests:weekly:${pointId}:completed`,
} as const;

export const GARBAGE_TYPES = [
  'Cardboard',
  'Glass',
  'Metal',
  'Paper',
  'Plastic',
  'Trash',
] as const;

export const GARBAGE_SUBTYPES = [
  'pet_bottle',
  'pet_bottle_white',
  'pet_container',
  'hdpe_container',
  'hdpe_film',
  'hdpe_bag',
  'pp_container',
  'pp_large',
  'pp_bag',
  'foam_packaging',
  'foam_egg',
  'foam_building',
  'foam_food',
  'blister_pack',
  'toothbrush',
  'plastic_card',
  'tube',
  'receipt',
  'unknown',
] as const;

export const GARBAGE_STATES = [
  'clean',
  'dirty',
  'heavily_dirty',
  'food_contaminated',
  'with_labels',
  'no_labels',
  'compressed',
  'damaged',
  'unknown',
] as const;

export const QUEST_GOAL = {
  DAILY: {
    MIN: 5,
    MAX: 10,
  },
  WEEKLY: {
    MIN: 20,
    MAX: 40,
  },
} as const;

export type GarbageType = (typeof GARBAGE_TYPES)[number];
export type GarbageSubtype = (typeof GARBAGE_SUBTYPES)[number];
export type GarbageState = (typeof GARBAGE_STATES)[number];
