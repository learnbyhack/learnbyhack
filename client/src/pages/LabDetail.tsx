import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Users, Lightbulb, Flag, CheckCircle2, Terminal, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Badge, difficultyVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { labs } from '@/data/labs';
import { useAuth } from '@/contexts/AuthContext';
import { submitFlag } from '@/services/submissionService';

export default function LabDetail() {
  const { labId } = useParams<{ labId: string }>();
  const { firebaseUser, profile, refreshProfile } = useAuth();
  const lab = labs.find((l) => l.id === labId);

  const [flag, setFlag] = useState('');
  const [revealedHints, setRevealedHints] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  if (!lab) return <Navigate to="/labs" replace />;

  const isDone = profile?.completedLabs.includes(lab.id) ?? false;

  const handleSubmit = async () => {
    if (!firebaseUser) {
      toast.error('Log in to submit a flag.');
      return;
    }
    if (!flag.trim()) return;
    setSubmitting(true);
    try {
      const res = await submitFlag(lab.id, flag);
      if (res.correct) {
        setResult('correct');
        toast.success(res.alreadySolved ? 'Already solved — nice work.' : `Correct! +${res.xpAwarded} XP`);
        await refreshProfile();
      } else {
        setResult('incorrect');
        toast.error('That\u2019s not it. Keep going.');
      }
    } catch (err) {
      // Cloud Function may not be deployed in every environment; fail gracefully.
      toast.error('Could not verify flag right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-raised">
      <div className="container py-10">
        <Link to="/labs" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to labs
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{lab.category}</Badge>
                <Badge variant={difficultyVariant(lab.difficulty)}>{lab.difficulty}</Badge>
                {isDone && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Solved</Badge>}
              </div>
              <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">{lab.title}</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{lab.description}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {lab.tags.map((t) => (
                  <span key={t} className="rounded-md bg-surface-sunken px-2.5 py-1 font-mono text-xs text-ink-muted">#{t}</span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-5 text-sm text-ink-muted">
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-brand-500" /> {lab.xp} XP</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> ~{lab.estimatedMinutes} min</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {lab.solvedBy.toLocaleString()} solves</span>
              </div>
            </Card>

            {/* Hints */}
            <Card className="p-7">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                <h3 className="font-display text-base font-semibold text-ink">Hints</h3>
              </div>
              <div className="mt-4 space-y-3">
                {lab.hints.map((hint, i) => (
                  <div key={i} className="rounded-xl border border-border bg-surface-raised p-4">
                    {i < revealedHints ? (
                      <p className="text-sm text-ink-muted">{hint}</p>
                    ) : (
                      <button
                        onClick={() => setRevealedHints((r) => Math.max(r, i + 1))}
                        className="text-sm font-medium text-brand-600 hover:underline"
                      >
                        Reveal hint {i + 1} (costs 10 coins)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar: connect + submit */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-ink px-5 py-3.5">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-xs text-white/70">lab environment</span>
              </div>
              <div className="space-y-1.5 p-5 font-mono text-[13px]">
                <p className="text-ink-muted">$ connect --lab {lab.id}</p>
                <p className="text-ink-muted">target: 10.10.{Math.floor(Math.random() * 200) + 10}.{Math.floor(Math.random() * 200) + 10}</p>
                <p className="text-success">status: instance ready</p>
              </div>
              <div className="border-t border-border p-5">
                <Button className="w-full">Launch environment</Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-brand-600" />
                <h3 className="font-display text-base font-semibold text-ink">Submit flag</h3>
              </div>
              <div className="relative mt-4">
                <Input
                  placeholder="LBH{...}"
                  value={flag}
                  onChange={(e) => { setFlag(e.target.value); setResult('idle'); }}
                  className="font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <AnimatePresence>
                {result === 'correct' && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 flex items-center gap-1.5 text-sm text-success"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Correct flag!
                  </motion.p>
                )}
                {result === 'incorrect' && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-sm text-danger"
                  >
                    Incorrect — give it another shot.
                  </motion.p>
                )}
              </AnimatePresence>
              <Button onClick={handleSubmit} loading={submitting} className="mt-4 w-full">
                Submit
              </Button>
              <p className="mt-3 text-center text-xs text-ink-faint">
                Flags are verified server-side. Nothing here is sent to your browser.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
