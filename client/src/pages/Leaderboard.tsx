import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Coins, FlaskConical, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { fetchLeaderboard } from '@/services/leaderboardService';
import { LeaderboardEntry } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const PODIUM_TINTS = ['from-amber-300 to-amber-500', 'from-slate-300 to-slate-400', 'from-orange-300 to-orange-500'];

export default function Leaderboard() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState('all-time');

  useEffect(() => {
    fetchLeaderboard(50)
      .then(setEntries)
      .catch(() => setError(true));
  }, []);

  const top3 = entries?.slice(0, 3) ?? [];
  const rest = entries?.slice(3) ?? [];

  return (
    <div>
      <PageHeader
        kicker="Ranked by XP"
        title="Leaderboard"
        description="Solve labs, win events, climb the board. Updated live the moment a flag is verified."
      >
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all-time">All time</TabsTrigger>
          </TabsList>
        </Tabs>
      </PageHeader>

      <div className="container py-12">
        {error && (
          <EmptyState
            icon={Crown}
            title="Leaderboard unavailable"
            description="We couldn't reach the ranking service. Refresh to try again."
          />
        )}

        {!error && !entries && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        )}

        {entries && entries.length === 0 && (
          <EmptyState icon={Crown} title="No rankings yet" description="Be the first to solve a lab and claim the top spot." />
        )}

        {top3.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            {top3.map((e, i) => (
              <motion.div
                key={e.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={cn('order-2', i === 0 && 'sm:order-1 sm:-translate-y-3', i === 2 && 'sm:order-3')}
              >
                <Card className="relative overflow-hidden p-6 text-center">
                  <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', PODIUM_TINTS[i])} />
                  <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-surface-sunken text-xs font-bold text-ink-muted">
                    {i + 1}
                  </span>
                  <Avatar name={e.name} src={e.profileImage} size="xl" className="mx-auto mt-3" ring />
                  {i === 0 && <Crown className="mx-auto -mt-3 h-5 w-5 text-amber-500" />}
                  <p className="mt-2 font-display text-base font-semibold text-ink">{e.name}</p>
                  <p className="text-xs text-ink-muted">@{e.username}</p>
                  <p className="mt-3 font-display text-xl font-semibold text-brand-600">{e.xp.toLocaleString()} XP</p>
                  <div className="mt-3 flex justify-center gap-4 text-xs text-ink-muted">
                    <span className="flex items-center gap-1"><Coins className="h-3 w-3" /> {e.coins}</span>
                    <span className="flex items-center gap-1"><FlaskConical className="h-3 w-3" /> {e.completedLabs}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <Card className="mt-8 divide-y divide-border overflow-hidden">
            {rest.map((e, i) => {
              const isYou = profile?.uid === e.uid;
              return (
                <motion.div
                  key={e.uid}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.02 }}
                  className={cn('flex items-center gap-4 px-5 py-3.5', isYou && 'bg-brand-50/60')}
                >
                  <span className="w-6 text-center text-sm font-semibold text-ink-muted">{i + 4}</span>
                  <Avatar name={e.name} src={e.profileImage} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{e.name} {isYou && <span className="text-brand-600">(you)</span>}</p>
                    <p className="truncate text-xs text-ink-muted">@{e.username} · Level {e.level}</p>
                  </div>
                  <p className="font-display text-sm font-semibold text-ink">{e.xp.toLocaleString()} XP</p>
                </motion.div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
