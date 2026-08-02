import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MessageSquare, Bookmark, FileText } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/shared/EmptyState';
import { writeups } from '@/data/writeups';
import { formatRelative } from '@/utils/format';

export default function Writeups() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const categories = ['All', ...Array.from(new Set(writeups.map((w) => w.category)))];

  const filtered = useMemo(
    () =>
      writeups.filter((w) => {
        const matchesQuery = w.title.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === 'All' || w.category === category;
        return matchesQuery && matchesCategory;
      }),
    [query, category]
  );

  const toggleBookmark = (id: string) =>
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div>
      <PageHeader
        kicker="Community knowledge"
        title="Writeups"
        description="Full walkthroughs from the community — how the vulnerability was found, exploited, and fixed."
      />

      <div className="container py-12">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <Input placeholder="Search writeups…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-52">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon={FileText} title="No writeups found" description="Try a different search term or category." />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {filtered.map((w) => (
              <Card key={w.id} className="flex flex-col p-6">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{w.category}</Badge>
                  <button onClick={() => toggleBookmark(w.id)} className="text-ink-faint hover:text-brand-600">
                    <Bookmark className={`h-4 w-4 ${bookmarked.has(w.id) ? 'fill-brand-600 text-brand-600' : ''}`} />
                  </button>
                </div>
                <Link to={`/writeups/${w.id}`}>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink hover:text-brand-600">{w.title}</h3>
                </Link>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{w.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {w.tags.map((t) => (
                    <span key={t} className="rounded-md bg-surface-sunken px-2 py-0.5 font-mono text-[11px] text-ink-muted">#{t}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={w.author} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-ink">{w.author}</p>
                      <p className="text-[11px] text-ink-faint">{formatRelative(w.publishedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-muted">
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {w.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {w.comments}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
