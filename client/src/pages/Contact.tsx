import { FormEvent, useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError('Could not send your message right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        kicker="We read everything"
        title="Get in touch"
        description="Questions about a lab, a partnership idea, or a bug in the platform itself — this goes straight to the team."
      />

      <div className="container grid gap-8 py-14 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {[
            { icon: Mail, title: 'Email', body: 'support@learnbyhack.io' },
            { icon: MessageCircle, title: 'Community', body: 'Join the Discord for faster answers' },
            { icon: MapPin, title: 'Based in', body: 'Remote-first, worldwide team' },
          ].map((c) => (
            <Card key={c.title} className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-ink">{c.title}</p>
                <p className="text-sm text-ink-muted">{c.body}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-7 lg:col-span-3">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-success">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">Message sent</h3>
              <p className="mt-1.5 text-sm text-ink-muted">We\u2019ll get back to you within a day or two.</p>
              <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="c-name">Name</Label>
                  <Input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="c-message">Message</Label>
                <Textarea id="c-message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-[140px]" />
              </div>
              {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
              <Button type="submit" loading={submitting} className="w-full sm:w-auto">
                <Send className="h-4 w-4" /> Send message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
