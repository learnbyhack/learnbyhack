import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Search, ChevronDown, LogOut, User as UserIcon, LayoutDashboard, Flame } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { buttonVariants } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';
import { formatXp } from '@/utils/gamification';
import { GlobalSearch } from '@/components/shared/GlobalSearch';

const NAV_LINKS = [
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/learning-path', label: 'Learning Path' },
  { to: '/labs', label: 'Labs' },
  { to: '/events', label: 'Events' },
  { to: '/writeups', label: 'Writeups' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export function Navbar() {
  const { firebaseUser, profile, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-colors',
          scrolled ? 'border-border bg-white/85 backdrop-blur-md' : 'border-transparent bg-white/60 backdrop-blur-md'
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors',
                      isActive ? 'text-ink' : 'text-ink-muted hover:text-ink hover:bg-surface-sunken'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-border-strong bg-white px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-brand-300 sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
              <kbd className="rounded border border-border bg-surface-sunken px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>

            {firebaseUser && profile ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2.5 transition-colors hover:border-brand-300"
                >
                  <Avatar name={profile.name} src={profile.profileImage} size="sm" />
                  <span className="hidden text-sm font-medium text-ink sm:inline">{profile.name.split(' ')[0]}</span>
                  <span className="hidden items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 sm:flex">
                    <Flame className="h-3 w-3" /> {formatXp(profile.xp)} XP
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-ink-faint" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-raised"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface-sunken"
                      >
                        <LayoutDashboard className="h-4 w-4 text-ink-muted" /> Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface-sunken"
                      >
                        <UserIcon className="h-4 w-4 text-ink-muted" /> Profile
                      </Link>
                      <div className="my-1 h-px bg-border" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                  Log in
                </Link>
                <Link to="/register" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                  Start learning
                </Link>
              </div>
            )}

            <button
              className="rounded-lg p-2 text-ink lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-white lg:hidden"
            >
              <div className="container flex flex-col gap-1 py-3">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-sunken"
                  >
                    {link.label}
                  </NavLink>
                ))}
                {!firebaseUser && (
                  <div className="mt-2 flex gap-2 border-t border-border pt-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants({ variant: 'outline' }), 'flex-1')}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants({ variant: 'primary' }), 'flex-1')}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
