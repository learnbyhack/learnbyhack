import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Users, ShieldCheck, Rocket, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const VALUES = [
  { icon: Target, title: 'Learn by doing', body: 'Every concept is paired with a real, hands-on environment — never just a slide.' },
  { icon: ShieldCheck, title: 'Practiced responsibly', body: 'All infrastructure is sandboxed and isolated, built for safe, legal practice.' },
  { icon: Users, title: 'Built with the community', body: 'Labs and writeups come from working practitioners, not just curriculum writers.' },
  { icon: Rocket, title: 'Always shipping', body: 'New labs, tracks, and events go live every week — the platform never goes stale.' },
];

const TEAM = [
  { name: 'Dana Okafor', role: 'Founder & Platform Lead' },
  { name: 'Theo Ivanov', role: 'Head of Labs' },
  { name: 'Sana Kapoor', role: 'Community & Events' },
  { name: 'Miles Chen', role: 'Security Engineering' },
];

export default function About() {
  return (
    <div>
      <PageHeader
        kicker="Why we built this"
        title="Security training that respects your time"
        description="LearnByHack exists because most security education is either too theoretical to be useful, or too scattered to follow. We built one place with a clear path from zero to capable."
      />

      <section className="container py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-[15px] font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{v.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-surface-raised py-16">
        <div className="container">
          <div className="max-w-lg">
            <p className="kicker mb-3">The people behind it</p>
            <h2 className="text-3xl font-semibold">A small team, obsessed with getting the details right.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <Card key={m.name} className="p-5 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 font-display text-lg font-semibold text-white">
                  {m.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <p className="mt-3 text-sm font-medium text-ink">{m.name}</p>
                <p className="text-xs text-ink-muted">{m.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 text-center">
        <h2 className="mx-auto max-w-md font-display text-2xl font-semibold text-ink sm:text-3xl">
          Ready to see what you're capable of?
        </h2>
        <Link to="/register" className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'mt-6 inline-flex')}>
          Create free account <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
