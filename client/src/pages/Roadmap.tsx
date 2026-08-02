import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Zap, ChevronDown, Lock } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { roadmapNodes } from '@/data/roadmap';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const LEVEL_TINTS: Record<string, string> = {
  Beginner: 'success',
  Intermediate: 'brand',
  Advanced: 'cyan',
  Expert: 'warning',
  Master: 'danger',
};

export default function Roadmap() {
  const { profile } = useAuth();
  const [openId, setOpenId] = useState<string | null>(roadmapNodes[0].id);
  const completed = new Set(profile?.completedRoadmaps ?? []);

  const totalXp = roadmapNodes.reduce((sum, n) => sum + n.xp, 0);
  const earnedXp = roadmapNodes.filter((n) => completed.has(n.id)).reduce((sum, n) => sum + n.xp, 0);

  return (
    <div>
      <PageHeader
        kicker="Your path, in order"
        title="The full roadmap"
        description="Six tracks, thirty-eight topics, one clear order — from your first `ls -la` to production exploit chains."
      >
        <div className="max-w-md rounded-2xl border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink">Overall progress</span>
            <span className="text-ink-muted">{earnedXp} / {totalXp} XP</span>
          </div>
          <div className="mt-2.5">
            <Progress value={(earnedXp / totalXp) * 100} />
          </div>
        </div>
      </PageHeader>

      <div className="container py-14">
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute bottom-0 left-[27px] top-0 w-px bg-border sm:left-[31px]" />
          <div className="space-y-4">
            {roadmapNodes.map((node, i) => {
              const isDone = completed.has(node.id);
              const isOpen = openId === node.id;
              const isNext = !isDone && roadmapNodes.slice(0, i).every((n) => completed.has(n.id));

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4 }}
                  className="relative flex gap-4 sm:gap-5"
                >
                  <div className="relative z-10 shrink-0">
                    <span
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-2xl border-2 bg-white shadow-soft',
                        isDone
                          ? 'border-success text-success'
                          : isNext
                          ? 'border-brand-500 text-brand-600'
                          : 'border-border text-ink-faint'
                      )}
                    >
                      {isDone ? <CheckCircle2 className="h-6 w-6" /> : isNext ? <Circle className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                    </span>
                  </div>

                  <div className="w-full overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
                    <button
                      onClick={() => setOpenId(isOpen ? null : node.id)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={LEVEL_TINTS[node.level] as any}>{node.level}</Badge>
                          {isDone && <Badge variant="success">Completed</Badge>}
                          {isNext && !isDone && <Badge variant="brand">Up next</Badge>}
                        </div>
                        <h3 className="mt-2 font-display text-lg font-semibold text-ink">{node.title}</h3>
                        <p className="mt-1 text-sm text-ink-muted">{node.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted">
                          <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> {node.xp} XP</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{node.estimatedHours}h</span>
                          <span>{node.topics.length} topics</span>
                        </div>
                      </div>
                      <ChevronDown className={cn('h-4 w-4 shrink-0 text-ink-muted transition-transform', isOpen && 'rotate-180')} />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border p-5">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {node.topics.map((t) => (
                            <div key={t.id} className="rounded-xl border border-border bg-surface-raised p-3.5">
                              <p className="text-sm font-medium text-ink">{t.title}</p>
                              <p className="mt-0.5 text-xs text-ink-muted">{t.description}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button size="sm" variant={isDone ? 'outline' : 'primary'}>
                            {isDone ? 'Review track' : isNext ? 'Start track' : 'Continue track'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
