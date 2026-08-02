import { LabelHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('mb-1.5 block text-[13px] font-medium text-ink', className)}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
