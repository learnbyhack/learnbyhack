import { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, checked, ...props }, ref) => (
    <span className="relative inline-flex h-5 w-5 shrink-0">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={cn('peer absolute inset-0 h-5 w-5 cursor-pointer opacity-0', className)}
        {...props}
      />
      <span
        className={cn(
          'pointer-events-none flex h-5 w-5 items-center justify-center rounded-md border border-border-strong bg-white transition-colors',
          'peer-checked:border-brand-500 peer-checked:bg-brand-500',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2'
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </span>
    </span>
  )
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
