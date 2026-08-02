const XP_PER_LEVEL = 500;

function levelFromXp(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

const ACHIEVEMENT_THRESHOLDS = [
  { count: 1, id: 'first-lab' },
  { count: 10, id: 'labs-10' },
  { count: 25, id: 'labs-25' },
  { count: 50, id: 'labs-50' },
  { count: 100, id: 'labs-100' },
];

function achievementsForLabCount(count) {
  return ACHIEVEMENT_THRESHOLDS.filter((t) => count >= t.count).map((t) => t.id);
}

module.exports = { XP_PER_LEVEL, levelFromXp, achievementsForLabCount };
