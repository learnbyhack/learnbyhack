import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flag, Map, BookOpen, FileText, CalendarClock } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { labs } from '@/data/labs';
import { roadmapNodes } from '@/data/roadmap';
import { courses } from '@/data/courses';
import { writeups } from '@/data/writeups';
import { events } from '@/data/events';

interface Result {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: typeof Flag;
}

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const results = useMemo<Result[]>(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const all: Result[] = [
      ...labs.map((l) => ({ id: l.id, title: l.title, subtitle: `Lab · ${l.category} · ${l.difficulty}`, href: `/labs/${l.id}`, icon: Flag })),
      ...roadmapNodes.map((r) => ({ id: r.id, title: r.title, subtitle: `Roadmap · ${r.level}`, href: `/roadmap`, icon: Map })),
      ...courses.map((c) => ({ id: c.id, title: c.title, subtitle: `Course · ${c.category}`, href: `/learning-path`, icon: BookOpen })),
      ...writeups.map((w) => ({ id: w.id, title: w.title, subtitle: `Writeup · by ${w.author}`, href: `/writeups/${w.id}`, icon: FileText })),
      ...events.map((e) => ({ id: e.id, title: e.title, subtitle: `Event · ${e.status}`, href: `/events`, icon: CalendarClock })),
    ];
    return all.filter((r) => r.title.toLowerCase().includes(query)).slice(0, 8);
  }, [q]);

  const go = (href: string) => {
    navigate(href);
    setQ('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => { setQ(''); onClose(); }} className="max-w-xl p-0 overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
        <Search className="h-4 w-4 text-ink-faint" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search labs, roadmaps, courses, writeups, events…"
          className="h-auto border-none p-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="max-h-80 overflow-y-auto p-2">
        {q.trim() === '' && (
          <p className="px-3 py-6 text-center text-sm text-ink-muted">Start typing to search the whole platform.</p>
        )}
        {q.trim() !== '' && results.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-ink-muted">No results for “{q}”.</p>
        )}
        {results.map((r) => (
          <button
            key={r.id}
            onClick={() => go(r.href)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-sunken"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <r.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{r.title}</span>
              <span className="block truncate text-xs text-ink-muted">{r.subtitle}</span>
            </span>
          </button>
        ))}
      </div>
    </Dialog>
  );
}
