import { CtfEvent } from '@/types';

const DAY = 86400000;
const now = Date.now();

export const events: CtfEvent[] = [
  {
    id: 'evt-Dr4g0n-CTF',
    title: 'Dr4g0n CTF 2026',
    description:
      'A 30-Days jeopardy-style CTF spanning web, crypto, forensics and binary exploitation. Solo or teams of up to 4.',
    status: 'upcoming',
    startsAt: now + 9 * DAY,
    endsAt: now + 9 * DAY + 2 * DAY,
    participants: 1284,
    difficulty: 'Medium',
    prize: '$1,000 prize pool + platform badges',
    rules: [
      'Individual participation only.',
      'Flag sharing results in disqualification.',
      'Automated scanning of infrastructure is not allowed.',
      'First blood on each challenge earns bonus XP.',
    ],
  },
  {
    id: 'evt-redline-weekly',
    title: 'Redline Weekly #42',
    description:
      'Our recurring Friday-night speedrun: 10 web and network challenges, ranked purely by solve time.',
    status: 'ongoing',
    startsAt: now - 1 * DAY,
    endsAt: now + 1 * DAY,
    participants: 642,
    difficulty: 'Easy',
    prize: 'Top 3 get the Redline badge',
    rules: ['Solo only.', 'Hints cost XP.', 'Leaderboard updates live.'],
  },
  {
    id: 'evt-summer-siege',
    title: 'Summer Siege 2026',
    description: 'Our largest event of the year: attack-defense across 20 vulnerable services.',
    status: 'completed',
    startsAt: now - 60 * DAY,
    endsAt: now - 58 * DAY,
    participants: 2190,
    difficulty: 'Hard',
    prize: '$5,000 prize pool',
    rules: ['Teams of up to 5.', 'Service uptime counts toward score.', 'Patch submissions are reviewed manually.'],
  },
  {
    id: 'evt-cloud-crucible',
    title: 'Cloud Crucible',
    description: 'A focused event on AWS and Azure misconfigurations, built entirely around real-world cloud attack paths.',
    status: 'completed',
    startsAt: now - 120 * DAY,
    endsAt: now - 119 * DAY,
    participants: 890,
    difficulty: 'Hard',
    prize: '$1,500 prize pool',
    rules: ['Solo only.', 'Sandbox environments reset every 4 hours.'],
  },
];
