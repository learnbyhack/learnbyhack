import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-2.5', className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
        <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 10L50 18V30C50 41.5 42.7 49.9 32 54C21.3 49.9 14 41.5 14 30V18L32 10Z"
            fill="url(#logo-grad)"
          />
          <path d="M25 31.5L29.5 36L39.5 26" stroke="#0B1220" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5F78FF" />
              <stop offset="100%" stopColor="#22CCC2" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className={cn('font-display text-[17px] font-semibold tracking-tight', dark ? 'text-white' : 'text-ink')}>
        LearnByHack
      </span>
    </Link>
  );
}
