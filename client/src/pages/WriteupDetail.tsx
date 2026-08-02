import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Heart, MessageSquare, Share2, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { writeups } from '@/data/writeups';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

interface LocalComment {
  id: string;
  author: string;
  body: string;
  at: number;
}

export default function WriteupDetail() {
  const { writeupId } = useParams<{ writeupId: string }>();
  const { profile } = useAuth();
  const writeup = writeups.find((w) => w.id === writeupId);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(writeup?.likes ?? 0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<LocalComment[]>([]);

  if (!writeup) return <Navigate to="/writeups" replace />;

  const toggleLike = () => {
    setLiked((l) => !l);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const share = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    toast.success('Link copied to clipboard.');
  };

  const postComment = () => {
    if (!profile) {
      toast.error('Log in to comment.');
      return;
    }
    if (!comment.trim()) return;
    setComments((c) => [...c, { id: crypto.randomUUID(), author: profile.name, body: comment.trim(), at: Date.now() }]);
    setComment('');
  };

  return (
    <div className="bg-surface-raised">
      <div className="container max-w-3xl py-10">
        <Link to="/writeups" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to writeups
        </Link>

        <Card className="mt-6 p-7 sm:p-10">
          <Badge variant="outline">{writeup.category}</Badge>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">{writeup.title}</h1>

          <div className="mt-5 flex items-center justify-between border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <Avatar name={writeup.author} />
              <div>
                <p className="text-sm font-medium text-ink">{writeup.author}</p>
                <p className="text-xs text-ink-muted">{formatDate(writeup.publishedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLike}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                  liked ? 'border-rose-200 bg-rose-50 text-danger' : 'border-border-strong text-ink-muted hover:border-brand-300'
                )}
              >
                <Heart className={cn('h-3.5 w-3.5', liked && 'fill-current')} /> {likeCount}
              </button>
              <button
                onClick={share}
                className="flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-brand-300"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </div>

          <article className="prose-writeup mt-6 max-w-none text-[15px] leading-relaxed text-ink [&_code]:rounded [&_code]:bg-surface-sunken [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_p]:mt-3 [&_pre]:mt-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-ink [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:text-white [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{writeup.content}</ReactMarkdown>
          </article>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {writeup.tags.map((t) => (
              <span key={t} className="rounded-md bg-surface-sunken px-2.5 py-1 font-mono text-xs text-ink-muted">#{t}</span>
            ))}
          </div>
        </Card>

        <Card className="mt-6 p-7">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
            <MessageSquare className="h-4 w-4" /> Comments ({comments.length})
          </h3>
          <div className="mt-4 flex gap-3">
            <Avatar name={profile?.name ?? 'You'} size="sm" />
            <div className="flex-1">
              <Textarea
                placeholder={profile ? 'Add a comment…' : 'Log in to comment'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={!profile}
                className="min-h-[70px]"
              />
              <Button size="sm" className="mt-2" onClick={postComment} disabled={!profile}>
                <Send className="h-3.5 w-3.5" /> Post
              </Button>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Avatar name={c.author} size="sm" />
                <div>
                  <p className="text-sm font-medium text-ink">{c.author}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
