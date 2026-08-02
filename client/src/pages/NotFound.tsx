import { Link } from 'react-router-dom';
import { ArrowLeft, TerminalSquare } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink">
        <TerminalSquare className="h-6 w-6 text-cyan-400" />
      </span>
      <p className="mt-6 font-mono text-sm text-ink-muted">$ curl learnbyhack.io{window.location.pathname}</p>
      <h1 className="mt-2 font-display text-5xl font-semibold text-ink">404</h1>
      <p className="mt-3 max-w-sm text-[15px] text-ink-muted">
        This route doesn\u2019t exist — which, on a security platform, is at least on-brand.
      </p>
      <Link to="/" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'mt-7')}>
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
    </div>
  );
}
