import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function PageHeader({
  kicker,
  title,
  description,
  children,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('relative overflow-hidden border-b border-border bg-surface-raised', className)}>
      <div className="grid-bg absolute inset-0" />
      <div className="container relative py-14 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {kicker && <p className="kicker mb-3">{kicker}</p>}
          <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{description}</p>}
        </motion.div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
