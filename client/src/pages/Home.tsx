import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Map,
  FlaskConical,
  Trophy,
  LineChart,
  Award,
  Swords,
  Star,
  ChevronDown,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TerminalHeroFallback } from '@/components/shared/TerminalHero';
import { cn } from '@/utils/cn';
import { useState } from 'react';

const FEATURES = [
  {
    icon: Map,
    title: 'Learning Paths',
    description: 'Structured tracks from Beginner to Master, so you never have to guess what to learn next.',
  },
  {
    icon: FlaskConical,
    title: 'Hands-on Labs',
    description: 'Real vulnerable systems across 12 categories — not multiple-choice quizzes about theory.',
  },
  {
    icon: Swords,
    title: 'Live CTF Events',
    description: 'Timed competitions with real prize pools and a scoreboard that updates in real time.',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Global rankings by XP, updated the moment you submit a correct flag.',
  },
  {
    icon: LineChart,
    title: 'Progress Tracking',
    description: 'Weekly and monthly breakdowns of exactly what you\u2019ve learned and what\u2019s next.',
  },
  {
    icon: Award,
    title: 'Achievements',
    description: 'Badges and milestones that actually mean something — tied to real solves, not logins.',
  },
];

const STATS = [
  { value: '48,000+', label: 'Learners' },
  { value: '210', label: 'Hands-on labs' },
  { value: '1,200+', label: 'Writeups published' },
  { value: '96%', label: 'Would recommend' },
];

const TESTIMONIALS = [
  {
    quote:
      'I went from not knowing what a request header was to landing my first bug bounty payout in four months. The roadmap ordering is what made it click.',
    name: 'Priya Shah',
    role: 'Junior Pentester',
  },
  {
    quote:
      'Every other platform gives you a terminal and a Discord link. This one actually tells you why the exploit works, not just that it worked.',
    name: 'Marcus Webb',
    role: 'Security Engineer',
  },
  {
    quote:
      'The CTF events are the closest thing to a real engagement I\u2019ve found outside of work. Genuinely well-built infrastructure.',
    name: 'Aiko Tanaka',
    role: 'SOC Analyst',
  },
];

const FAQS = [
  {
    q: 'Do I need any prior experience?',
    a: 'No. The Foundations track starts with networking, Linux, and scripting basics before touching a single vulnerability class. Most learners with zero background are solving their first lab within a week.',
  },
  {
    q: 'Is this legal to practice on?',
    a: 'Yes. Every lab and CTF environment runs in an isolated sandbox built specifically for this platform. You are never interacting with production systems or third-party infrastructure.',
  },
  {
    q: 'How is XP calculated?',
    a: 'You earn XP for solving labs, completing courses, finishing roadmap tracks, and placing in CTF events. XP determines your level and your position on the leaderboard.',
  },
  {
    q: 'Can I use this to prepare for certifications?',
    a: 'Yes — the OWASP Top 10, Active Directory, and Binary Exploitation tracks map closely to material covered in OSCP-style and web-focused industry certifications.',
  },
  {
    q: 'Is there a free tier?',
    a: 'Registration is free and includes the full Foundations and Web Fundamentals tracks, a rotating set of labs, and full leaderboard access.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border py-5">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span className="font-display text-[15px] font-medium text-ink">{q}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-ink-muted transition-transform', open && 'rotate-180')} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="pt-3 text-sm leading-relaxed text-ink-muted">{a}</p>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="grid-bg absolute inset-0" />
        <div className="bg-hero-glow absolute inset-0" />
        <div className="container relative grid gap-14 py-20 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="kicker mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              210 labs · live CTF events · real writeups
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.25rem]">
              Learn security by <span className="text-gradient">breaking</span> things,
              on purpose.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-muted">
              Structured roadmaps, hands-on labs, and live competitions — built for people who learn
              by doing, not by watching a slide deck about the OWASP Top 10.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/register" className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'group')}>
                Start learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/labs" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Explore labs
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2.5">
                {['A', 'K', 'N', 'R'].map((l, i) => (
                  <span
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-brand-500 to-cyan-400 text-xs font-semibold text-white"
                  >
                    {l}
                  </span>
                ))}
              </div>
              <p className="text-sm text-ink-muted">
                Joined by <span className="font-semibold text-ink">48,000+</span> learners this year
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <TerminalHeroFallback />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface-raised">
        <div className="container grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="font-display text-3xl font-semibold text-ink">{s.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <div className="max-w-xl">
          <p className="kicker mb-3">Everything you need, none of the fluff</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">One platform, from your first shell to your first CVE.</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="group h-full p-6 transition-all hover:-translate-y-1 hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-ink group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-raised py-24">
        <div className="container">
          <div className="max-w-xl">
            <p className="kicker mb-3">From the leaderboard</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">People who started exactly where you are.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="flex h-full flex-col p-6">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-xs font-semibold text-white">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="container py-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center sm:px-16">
          <div className="grid-bg absolute inset-0 opacity-20" />
          <div className="relative">
            <Badge variant="outline" className="border-white/20 bg-white/5 text-white/70">
              Free to start
            </Badge>
            <h2 className="mx-auto mt-5 max-w-lg font-display text-3xl font-semibold text-white sm:text-4xl">
              Your first lab is three minutes away.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-white/60">
              Create an account, pick a track, and submit your first flag today.
            </p>
            <Link
              to="/register"
              className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'mt-8 inline-flex')}
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="kicker mb-3 justify-center">Questions</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Frequently asked</h2>
          </div>
          <div className="mt-10">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
