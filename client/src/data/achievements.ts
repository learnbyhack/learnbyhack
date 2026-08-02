import { Achievement } from '@/types';

export const achievementsCatalog: Achievement[] = [
  { id: 'first-login', title: 'First Login', description: 'Signed in for the first time.', icon: 'LogIn', tier: 'bronze' },
  { id: 'first-lab', title: 'First Blood', description: 'Solved your first lab.', icon: 'Flag', tier: 'bronze' },
  { id: 'labs-10', title: 'Getting Serious', description: 'Solved 10 labs.', icon: 'Target', tier: 'bronze' },
  { id: 'labs-25', title: 'Momentum', description: 'Solved 25 labs.', icon: 'Zap', tier: 'silver' },
  { id: 'labs-50', title: 'Halfway There', description: 'Solved 50 labs.', icon: 'Swords', tier: 'silver' },
  { id: 'labs-100', title: 'Centurion', description: 'Solved 100 labs.', icon: 'Trophy', tier: 'gold' },
  { id: 'roadmap-complete', title: 'Path Finder', description: 'Completed a full roadmap track.', icon: 'Map', tier: 'gold' },
  { id: 'top-10', title: 'Top 10', description: 'Reached the top 10 on the leaderboard.', icon: 'Crown', tier: 'gold' },
  { id: 'perfect-quiz', title: 'Perfect Score', description: 'Aced a course quiz with no mistakes.', icon: 'CheckCircle2', tier: 'silver' },
  { id: 'event-winner', title: 'Champion', description: 'Won a live CTF event.', icon: 'Medal', tier: 'platinum' },
  { id: 'bug-hunter', title: 'Bug Hunter', description: 'Published a writeup that helped another user.', icon: 'Bug', tier: 'silver' },
];
