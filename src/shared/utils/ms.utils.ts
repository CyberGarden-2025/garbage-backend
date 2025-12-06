const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const units: Record<string, number> = {
  ms: 1,
  s: SECOND,
  sec: SECOND,
  m: MINUTE,
  min: MINUTE,
  h: HOUR,
  hour: HOUR,
  d: DAY,
  day: DAY,
  w: WEEK,
  week: WEEK,
};

export const ms = (value: string): number => {
  const match = value.match(
    /^(\d+)\s*(ms|s|sec|m|min|h|hour|d|day|w|week)s?$/i,
  );

  if (!match) {
    throw new Error(`Invalid time format: ${value}`);
  }

  const [, num, unit] = match;
  return parseInt(num, 10) * units[unit.toLowerCase()];
};

export const toSeconds = (value: string): number => {
  return Math.floor(ms(value) / 1000);
};
