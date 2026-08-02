import { useEffect, useState } from 'react';
import { formatCountdown } from '@/utils/format';

export function Countdown({ target }: { target: number }) {
  const [time, setTime] = useState(() => formatCountdown(target));

  useEffect(() => {
    const id = setInterval(() => setTime(formatCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (time.done) return <span className="text-sm font-medium text-ink-muted">Started</span>;

  return (
    <div className="flex gap-2.5">
      {[
        { v: time.d, l: 'd' },
        { v: time.h, l: 'h' },
        { v: time.m, l: 'm' },
        { v: time.s, l: 's' },
      ].map((u) => (
        <div key={u.l} className="flex min-w-[42px] flex-col items-center rounded-lg bg-ink px-2 py-1.5">
          <span className="font-mono text-base font-semibold text-white">{String(u.v).padStart(2, '0')}</span>
          <span className="font-mono text-[9px] uppercase text-white/40">{u.l}</span>
        </div>
      ))}
    </div>
  );
}
