import { useMemo, useState } from 'react';
import { Search, Bookmark, PlayCircle, Award, Clock, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { courses } from '@/data/courses';

const ICONS: Record<string, string> = {
  network: '🌐',
  linux: '🐧',
  web: '🕸️',
  windows: '🪟',
  binary: '🧮',
  cloud: '☁️',
};

export default function LearningPath() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const categories = ['All', ...Array.from(new Set(courses.map((c) => c.category)))];

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || c.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        kicker="Course-based learning"
        title="Learning Path"
        description="Video lessons, notes, quizzes, and a practice lab at the end of every course. Finish one, get a certificate."
      />

      <div className="container py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <Input
              placeholder="Search courses…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon={BookOpen} title="No courses found" description="Try a different search term or category." />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Card key={c.id} className="group flex flex-col overflow-hidden">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-50 to-cyan-50 text-4xl">
                  {ICONS[c.thumbnail] ?? '💻'}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline">{c.category}</Badge>
                    <button
                      onClick={() => toggleBookmark(c.id)}
                      aria-label="Bookmark course"
                      className="text-ink-faint hover:text-brand-600"
                    >
                      <Bookmark className={`h-4 w-4 ${bookmarked.has(c.id) ? 'fill-brand-600 text-brand-600' : ''}`} />
                    </button>
                  </div>
                  <h3 className="mt-2.5 font-display text-[15px] font-semibold text-ink">{c.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">{c.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted">
                    <span className="flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" /> {c.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.durationHours}h</span>
                    {c.hasCertificate && <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> Certificate</span>}
                  </div>
                  <Button size="sm" className="mt-4 w-full">
                    Start course
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
