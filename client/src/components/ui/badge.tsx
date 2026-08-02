import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-border bg-surface-sunken text-ink-muted',
        brand: 'border-brand-100 bg-brand-50 text-brand-700',
        cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700',
        success: 'border-green-100 bg-green-50 text-success',
        warning: 'border-amber-100 bg-amber-50 text-warning',
        danger: 'border-rose-100 bg-rose-50 text-danger',
        outline: 'border-border-strong bg-white text-ink',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function difficultyVariant(difficulty: string): BadgeProps['variant'] {
  switch (difficulty) {
    case 'Easy':
      return 'success';
    case 'Medium':
      return 'brand';
    case 'Hard':
      return 'warning';
    case 'Insane':
      return 'danger';
    default:
      return 'default';
  }
}

export { Badge, badgeVariants };
