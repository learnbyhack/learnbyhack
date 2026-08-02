import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AtSign, Eye, EyeOff, Lock, Mail, User, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { friendlyAuthError } from '@/utils/authErrors';

interface FormState {
  name: string;
  instagram: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const initialState: FormState = {
  name: '',
  instagram: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) errs.name = 'Enter your full name.';
    if (!/^[a-zA-Z0-9._]{2,30}$/.test(form.instagram.trim()))
      errs.instagram = 'Use letters, numbers, dots, or underscores only.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (form.password.length < 6) errs.password = 'At least 6 characters.';
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords don\u2019t match.';
    if (!form.acceptTerms) errs.acceptTerms = 'You must accept the terms to continue.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        username: form.instagram.trim().replace(/^@/, ''),
        email: form.email.trim(),
        password: form.password,
      });
      toast.success('Account created. Welcome to LearnByHack.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="grid-bg absolute inset-0 opacity-25" />
        <div className="relative flex h-full flex-col items-start justify-center px-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Sparkles className="h-6 w-6 text-cyan-400" />
          </span>
          <p className="mt-6 max-w-sm font-display text-2xl font-semibold text-white">
            Start at zero XP. That\u2019s the whole point.
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/50">
            48,000 learners started exactly here. The roadmap does the rest.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {['Free Foundations & Web Fundamentals tracks', 'Instant access to 40+ starter labs', 'Full leaderboard & achievement tracking'].map((t) => (
              <div key={t} className="flex items-center gap-2.5 text-sm text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Logo className="mb-8 lg:hidden" />
          <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1.5 text-sm text-ink-muted">Free forever. No credit card.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  id="name"
                  placeholder="Alex Rivera"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className="pl-10"
                  error={!!fieldErrors.name}
                />
              </div>
              {fieldErrors.name && <p className="mt-1 text-xs text-danger">{fieldErrors.name}</p>}
            </div>

            <div>
              <Label htmlFor="instagram">Instagram username</Label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  id="instagram"
                  placeholder="alex.rivera"
                  value={form.instagram}
                  onChange={(e) => set('instagram', e.target.value)}
                  className="pl-10"
                  error={!!fieldErrors.instagram}
                />
              </div>
              {fieldErrors.instagram && <p className="mt-1 text-xs text-danger">{fieldErrors.instagram}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="pl-10"
                  error={!!fieldErrors.email}
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-danger">{fieldErrors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <Input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    className="pl-10 pr-9"
                    error={!!fieldErrors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm</Label>
                <Input
                  id="confirmPassword"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  error={!!fieldErrors.confirmPassword}
                />
              </div>
            </div>
            {(fieldErrors.password || fieldErrors.confirmPassword) && (
              <p className="-mt-2 text-xs text-danger">{fieldErrors.password || fieldErrors.confirmPassword}</p>
            )}

            <div>
              <label className="flex cursor-pointer items-start gap-2.5">
                <Checkbox
                  checked={form.acceptTerms}
                  onChange={(e) => set('acceptTerms', e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-sm text-ink-muted">
                  I agree to the{' '}
                  <Link to="/about" className="font-medium text-brand-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and Privacy Policy.
                </span>
              </label>
              {fieldErrors.acceptTerms && <p className="mt-1 text-xs text-danger">{fieldErrors.acceptTerms}</p>}
            </div>

            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-danger">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
