import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ring?: boolean;
}

const sizes = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-24 w-24 text-2xl',
};

export function Avatar({ name, src, size = 'md', className, ring }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 font-display font-semibold text-white',
        sizes[size],
        ring && 'ring-4 ring-white shadow-card',
        className
      )}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : <span>{initials(name || '?')}</span>}
    </div>
  );
}
