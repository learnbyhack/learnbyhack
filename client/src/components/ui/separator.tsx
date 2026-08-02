import { cn } from '@/utils/cn';

export function Separator({ className, vertical }: { className?: string; vertical?: boolean }) {
  return (
    <div
      className={cn(vertical ? 'h-full w-px bg-border' : 'h-px w-full bg-border', className)}
    />
  );
}
