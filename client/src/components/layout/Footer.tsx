import { Link } from 'react-router-dom';
import { Github, Twitter, Youtube } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Learning Path', to: '/learning-path' },
      { label: 'Labs', to: '/labs' },
      { label: 'Events', to: '/events' },
      { label: 'Writeups', to: '/writeups' },
      { label: 'Leaderboard', to: '/leaderboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-raised">
      <div className="container py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Structured cybersecurity training, hands-on labs, and live CTF events — for people who\u2019d rather break things than read about them.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Github, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-600"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-ink-muted transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-ink-faint">© {new Date().getFullYear()} LearnByHack. All rights reserved.</p>
          <p className="font-mono text-xs text-ink-faint">Practice on our labs only. Unauthorized access elsewhere is illegal.</p>
        </div>
      </div>
    </footer>
  );
}
