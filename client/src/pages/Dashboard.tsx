import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Coins,
  Trophy,
  Zap,
  ArrowRight,
  FlaskConical,
  Map as MapIcon,
  Swords,
  UserCog,
  CalendarClock,
  Megaphone,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge, difficultyVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { labs } from '@/data/labs';
import { events } from '@/data/events';
import { roadmapNodes } from '@/data/roadmap';
import { levelFromXp, levelProgressPct, rankFromXp, xpToNextLevel } from '@/utils/gamification';
import { formatRelative } from '@/utils/format';

const ANNOUNCEMENTS = [
  { id: 1, title: 'Cloud Crucible II is now in planning', body: 'Vote on the challenge categories in the Events tab.', time: Date.now() - 2 * 3600000 },
  { id: 2, title: 'New track: Threat Hunting', body: 'Six new lessons just landed in the Defense & Bug Bounty track.', time: Date.now() - 26 * 3600000 },
];

export default function Dashboard() {
  const { profile } = useAuth();
  if (!profile) return null;

  const level = levelFromXp(profile.xp);
  const progress = levelProgressPct(profile.xp);
  const toNext = xpToNextLevel(profile.xp);
  const rank = rankFromXp(profile.xp);

  const completedSet = new Set(profile.completedLabs);
  const recommended = labs.filter((l) => !completedSet.has(l.id)).slice(0, 3);
  const inProgressRoadmap = roadmapNodes.find((r) => !profile.completedRoadmaps.includes(r.id)) ?? roadmapNodes[0];
  const upcomingEvents = events.filter((e) => e.status !== 'completed').slice(0, 2);

  const recentActivity = [
    ...profile.completedLabs.slice(-3).map((id) => {
      const lab = labs.find((l) => l.id === id);
      return { label: lab ? `Solved “${lab.title}”` : 'Solved a lab', time: profile.lastLogin };
    }),
  ];

  return (
    <div className="bg-surface-raised">
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-sm text-ink-muted">Welcome back,</p>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{profile.name.split(' ')[0]} 👋</h1>
        </motion.div>

        {/* Stat cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, label: 'Total XP', value: profile.xp.toLocaleString(), tint: 'brand' },
            { icon: TrendingUp, label: `Level ${level}`, value: `${toNext} XP to next`, tint: 'cyan' },
            { icon: Trophy, label: 'Rank', value: rank, tint: 'warning' },
            { icon: Coins, label: 'Coins', value: profile.coins.toLocaleString(), tint: 'success' },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <s.icon className="h-4 w-4" />
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-ink-muted">
                  <Flame className="h-3.5 w-3.5 text-warning" /> {profile.streak}d streak
                </span>
              </div>
              <p className="mt-3 font-display text-xl font-semibold text-ink">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left / main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Level progress */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink">Level progress</h3>
                <Badge variant="brand">Level {level} → {level + 1}</Badge>
              </div>
              <div className="mt-4">
                <Progress value={progress} />
                <div className="mt-2 flex justify-between text-xs text-ink-muted">
                  <span>{progress}% complete</span>
                  <span>{toNext} XP remaining</span>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5">
                <div>
                  <p className="text-xs text-ink-muted">This week</p>
                  <p className="font-display text-lg font-semibold text-ink">+{Math.min(profile.xp, 340)} XP</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">This month</p>
                  <p className="font-display text-lg font-semibold text-ink">+{Math.min(profile.xp, 1120)} XP</p>
                </div>
              </div>
            </Card>

            {/* Continue learning */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink">Continue learning</h3>
                <Link to="/roadmap" className="text-xs font-medium text-brand-600 hover:underline">
                  View roadmap
                </Link>
              </div>
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge variant="outline">{inProgressRoadmap.level}</Badge>
                  <p className="mt-2 font-display text-[15px] font-semibold text-ink">{inProgressRoadmap.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{inProgressRoadmap.description}</p>
                </div>
                <Link to="/roadmap" className="shrink-0">
                  <Button size="sm">
                    Continue <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recommended labs */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink">Recommended labs</h3>
                <Link to="/labs" className="text-xs font-medium text-brand-600 hover:underline">
                  Browse all
                </Link>
              </div>
              <div className="mt-4 divide-y divide-border">
                {recommended.map((lab) => (
                  <Link
                    key={lab.id}
                    to={`/labs/${lab.id}`}
                    className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:opacity-80"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-sunken text-ink-muted">
                        <FlaskConical className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{lab.title}</p>
                        <p className="text-xs text-ink-muted">{lab.category} · {lab.estimatedMinutes} min</p>
                      </div>
                    </div>
                    <Badge variant={difficultyVariant(lab.difficulty)}>{lab.difficulty}</Badge>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Right / sidebar column */}
          <div className="space-y-6">
            {/* Quick actions */}
            <Card className="p-6">
              <h3 className="font-display text-base font-semibold text-ink">Quick actions</h3>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {[
                  { icon: FlaskConical, label: 'Start a lab', to: '/labs' },
                  { icon: MapIcon, label: 'Roadmap', to: '/roadmap' },
                  { icon: Swords, label: 'Join event', to: '/events' },
                  { icon: UserCog, label: 'Edit profile', to: '/profile' },
                ].map((a) => (
                  <Link
                    key={a.label}
                    to={a.to}
                    className="flex flex-col items-start gap-2 rounded-xl border border-border p-3.5 transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <a.icon className="h-4 w-4 text-brand-600" />
                    <span className="text-xs font-medium text-ink">{a.label}</span>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Upcoming events */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink">Upcoming events</h3>
                <CalendarClock className="h-4 w-4 text-ink-faint" />
              </div>
              <div className="mt-4 space-y-3">
                {upcomingEvents.map((e) => (
                  <Link key={e.id} to="/events" className="block rounded-xl border border-border p-3.5 hover:border-brand-300">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ink">{e.title}</p>
                      <Badge variant={e.status === 'ongoing' ? 'success' : 'brand'}>{e.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">{e.participants.toLocaleString()} participants</p>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Announcements */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink">Latest announcements</h3>
                <Megaphone className="h-4 w-4 text-ink-faint" />
              </div>
              <div className="mt-4 space-y-4">
                {ANNOUNCEMENTS.map((a) => (
                  <div key={a.id}>
                    <p className="text-sm font-medium text-ink">{a.title}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{a.body}</p>
                    <p className="mt-1 text-[11px] text-ink-faint">{formatRelative(a.time)}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent activity */}
            <Card className="p-6">
              <h3 className="font-display text-base font-semibold text-ink">Recent activity</h3>
              <div className="mt-4 space-y-3">
                {recentActivity.length === 0 && (
                  <p className="text-sm text-ink-muted">Solve your first lab to see activity here.</p>
                )}
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    {a.label}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
