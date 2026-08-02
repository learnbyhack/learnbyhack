export const XP_PER_LEVEL = 500;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - xpIntoLevel(xp);
}

export function levelProgressPct(xp: number): number {
  return Math.round((xpIntoLevel(xp) / XP_PER_LEVEL) * 100);
}

const RANKS = [
  { min: 0, name: 'Script Kiddie' },
  { min: 1000, name: 'Analyst' },
  { min: 3000, name: 'Operator' },
  { min: 6000, name: 'Specialist' },
  { min: 10000, name: 'Red Teamer' },
  { min: 18000, name: 'Elite Hacker' },
  { min: 30000, name: 'Legend' },
];

export function rankFromXp(xp: number): string {
  let rank = RANKS[0].name;
  for (const r of RANKS) {
    if (xp >= r.min) rank = r.name;
  }
  return rank;
}

export function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(xp % 1000 === 0 ? 0 : 1)}k`;
  return `${xp}`;
}
