import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Zap, Users, FlaskConical } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge, difficultyVariant } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { labs } from '@/data/labs';
import { useAuth } from '@/contexts/AuthContext';
import { LabCategory, Difficulty } from '@/types';

const CATEGORIES: (LabCategory | 'All')[] = [
  'All', 'Web', 'Network', 'Linux', 'Windows', 'Forensics', 'OSINT', 'Cloud', 'API', 'Binary', 'Reverse Engineering', 'Cryptography', 'Programming',
];
const DIFFICULTIES: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard', 'Insane'];

export default function Labs() {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [difficulty, setDifficulty] = useState<string>('All');
  const completed = new Set(profile?.completedLabs ?? []);

  const filtered = useMemo(() => {
    return labs.filter((l) => {
      const matchesQuery = l.title.toLowerCase().includes(query.toLowerCase()) || l.tags.some((t) => t.includes(query.toLowerCase()));
      const matchesCategory = category === 'All' || l.category === category;
      const matchesDifficulty = difficulty === 'All' || l.difficulty === difficulty;
      return matchesQuery && matchesCategory && matchesDifficulty;
    });
  }, [query, category, difficulty]);

  return (
    <div>
      <PageHeader
        kicker={`${labs.length} labs across 12 categories`}
        title="Labs"
        description="Real, purpose-built vulnerable systems. Solve the challenge, submit the flag, earn the XP."
      />

      <div className="container py-12">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <Input placeholder="Search labs or tags…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-52">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="sm:w-40">
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
        </div>

        <p className="mt-4 text-sm text-ink-muted">{filtered.length} results</p>

        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={FlaskConical} title="No labs match those filters" description="Try clearing a filter or searching a different term." />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((lab) => {
              const isDone = completed.has(lab.id);
              return (
                <Link key={lab.id} to={`/labs/${lab.id}`}>
                  <Card className="group relative flex h-full flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-card">
                    {isDone && <Badge variant="success" className="absolute right-4 top-4">Solved</Badge>}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{lab.category}</Badge>
                      <Badge variant={difficultyVariant(lab.difficulty)}>{lab.difficulty}</Badge>
                    </div>
                    <h3 className="mt-3 font-display text-[15px] font-semibold text-ink">{lab.title}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">{lab.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {lab.tags.map((t) => (
                        <span key={t} className="rounded-md bg-surface-sunken px-2 py-0.5 font-mono text-[11px] text-ink-muted">#{t}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-ink-muted">
                      <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> {lab.xp} XP</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {lab.estimatedMinutes}m</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {lab.solvedBy.toLocaleString()}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
