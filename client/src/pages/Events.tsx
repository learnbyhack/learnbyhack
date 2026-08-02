import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Swords, Gauge, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Badge, difficultyVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Countdown } from '@/components/shared/Countdown';
import { EmptyState } from '@/components/shared/EmptyState';
import { events } from '@/data/events';
import { useAuth } from '@/contexts/AuthContext';
import { CtfEvent } from '@/types';
import { formatDate } from '@/utils/format';

const STATUS_COPY: Record<string, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Live now',
  completed: 'Completed',
};

export default function Events() {
  const { firebaseUser } = useAuth();
  const [tab, setTab] = useState('upcoming');
  const [active, setActive] = useState<CtfEvent | null>(null);
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const filtered = events.filter((e) => e.status === tab);

  const handleJoin = (event: CtfEvent) => {
    if (!firebaseUser) {
      toast.error('Log in to join an event.');
      return;
    }
    setJoined((prev) => new Set(prev).add(event.id));
    toast.success(`You're registered for ${event.title}.`);
  };

  return (
    <div>
      <PageHeader
        kicker="Timed, competitive, real prizes"
        title="Events"
        description="Jeopardy-style CTFs, speedruns, and full attack-defense engagements — solo or with a team."
      />

      <div className="container py-12">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {(['upcoming', 'ongoing', 'completed'] as const).map((status) => (
            <TabsContent key={status} value={status} className="mt-8">
              {filtered.length === 0 && tab === status ? (
                <EmptyState icon={Swords} title="Nothing here yet" description="Check back soon for new events." />
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {events.filter((e) => e.status === status).map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                    >
                      <Card className="flex h-full flex-col p-6">
                        <div className="flex items-center justify-between">
                          <Badge variant={event.status === 'ongoing' ? 'success' : event.status === 'upcoming' ? 'brand' : 'default'}>
                            {STATUS_COPY[event.status]}
                          </Badge>
                          <Badge variant={difficultyVariant(event.difficulty)}>{event.difficulty}</Badge>
                        </div>
                        <h3 className="mt-3 font-display text-lg font-semibold text-ink">{event.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{event.description}</p>

                        {event.status !== 'completed' && (
                          <div className="mt-4">
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
                              {event.status === 'upcoming' ? 'Starts in' : 'Ends in'}
                            </p>
                            <Countdown target={event.status === 'upcoming' ? event.startsAt : event.endsAt} />
                          </div>
                        )}

                        <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs text-ink-muted">
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {event.participants.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5" /> {event.prize}</span>
                        </div>

                        <div className="mt-5 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setActive(event)}>
                            View rules
                          </Button>
                          {event.status !== 'completed' ? (
                            joined.has(event.id) ? (
                              <Button size="sm" className="flex-1" variant="subtle" disabled>
                                <Check className="h-3.5 w-3.5" /> Registered
                              </Button>
                            ) : (
                              <Button size="sm" className="flex-1" onClick={() => handleJoin(event)}>
                                {event.status === 'ongoing' ? 'Join now' : 'Register'}
                              </Button>
                            )
                          ) : (
                            <Button size="sm" className="flex-1" variant="outline" onClick={() => setActive(event)}>
                              View results
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={!!active} onClose={() => setActive(null)} title={active?.title}>
        {active && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-ink-muted">{active.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-surface-raised p-3">
                <p className="text-xs text-ink-muted">Dates</p>
                <p className="font-medium text-ink">{formatDate(active.startsAt)} – {formatDate(active.endsAt)}</p>
              </div>
              <div className="rounded-lg bg-surface-raised p-3">
                <p className="text-xs text-ink-muted">Prize</p>
                <p className="font-medium text-ink">{active.prize}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink"><Gauge className="h-4 w-4" /> Rules</p>
              <ul className="space-y-1.5">
                {active.rules.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
