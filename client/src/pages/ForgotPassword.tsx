import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { auth } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/Logo';
import { friendlyAuthError } from '@/utils/authErrors';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Logo className="mb-8" />
        {sent ? (
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-xl font-semibold text-ink">Check your inbox</h1>
            <p className="mt-1.5 text-sm text-ink-muted">We sent a reset link to {email}.</p>
            <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-ink">Reset your password</h1>
            <p className="mt-1.5 text-sm text-ink-muted">Enter your email and we\u2019ll send a reset link.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="you@example.com" />
                </div>
              </div>
              {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
              <Button type="submit" className="w-full" size="lg" loading={loading}>Send reset link</Button>
            </form>
            <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
