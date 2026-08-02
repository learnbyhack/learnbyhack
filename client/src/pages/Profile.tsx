import { useState } from 'react';
import { Pencil, Zap, Coins, Flame, Trophy, FlaskConical, Instagram, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/userService';
import { achievementsCatalog } from '@/data/achievements';
import { labs } from '@/data/labs';
import { levelFromXp, levelProgressPct, rankFromXp } from '@/utils/gamification';
import { Progress } from '@/components/ui/progress';
import * as Icons from 'lucide-react';

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [saving, setSaving] = useState(false);

  if (!profile) return null;

  const level = levelFromXp(profile.xp);
  const progress = levelProgressPct(profile.xp);
  const rank = rankFromXp(profile.xp);
  const unlockedAchievements = new Set(profile.achievements);
  const solvedLabs = labs.filter((l) => profile.completedLabs.includes(l.id));

  const openEdit = () => {
    setName(profile.name);
    setUsername(profile.username);
    setBio(profile.bio ?? '');
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateUserProfile(profile.uid, { name: name.trim(), username: username.trim(), bio: bio.trim() });
      await refreshProfile();
      toast.success('Profile updated.');
      setEditing(false);
    } catch {
      toast.error('Could not save changes. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface-raised">
      <div className="container py-12">
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-brand-500 to-cyan-400" />
          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <Avatar name={profile.name} src={profile.profileImage} size="xl" ring />
              <Button variant="outline" size="sm" onClick={openEdit}>
                <Pencil className="h-3.5 w-3.5" /> Edit profile
              </Button>
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold text-ink">{profile.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5"><Instagram className="h-3.5 w-3.5" /> @{profile.username}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {profile.email}</span>
            </div>
            {profile.bio && <p className="mt-3 max-w-lg text-sm text-ink-muted">{profile.bio}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="brand">Level {level}</Badge>
              <Badge variant="cyan">{rank}</Badge>
              {profile.role === 'admin' && <Badge variant="warning">Admin</Badge>}
            </div>
          </div>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6">
              <h3 className="font-display text-base font-semibold text-ink">Statistics</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { icon: Zap, label: 'XP', value: profile.xp.toLocaleString() },
                  { icon: Coins, label: 'Coins', value: profile.coins.toLocaleString() },
                  { icon: Flame, label: 'Streak', value: `${profile.streak}d` },
                  { icon: FlaskConical, label: 'Labs solved', value: profile.completedLabs.length },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-surface-raised p-4">
                    <s.icon className="h-4 w-4 text-brand-600" />
                    <p className="mt-2 font-display text-lg font-semibold text-ink">{s.value}</p>
                    <p className="text-xs text-ink-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>Level {level} progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-1.5"><Progress value={progress} /></div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-display text-base font-semibold text-ink">Completed labs</h3>
              {solvedLabs.length === 0 ? (
                <p className="mt-3 text-sm text-ink-muted">No labs solved yet — your first one is a few minutes away.</p>
              ) : (
                <div className="mt-4 divide-y divide-border">
                  {solvedLabs.map((l) => (
                    <div key={l.id} className="flex items-center justify-between py-3">
                      <p className="text-sm text-ink">{l.title}</p>
                      <Badge variant="outline">{l.category}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <Trophy className="h-4 w-4 text-warning" /> Achievements
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {achievementsCatalog.map((a) => {
                const unlocked = unlockedAchievements.has(a.id);
                const Icon = (Icons as any)[a.icon] ?? Trophy;
                return (
                  <div
                    key={a.id}
                    className={`rounded-xl border p-3.5 text-center transition-opacity ${unlocked ? 'border-brand-200 bg-brand-50' : 'border-border bg-surface-raised opacity-45'}`}
                    title={a.description}
                  >
                    <Icon className={`mx-auto h-5 w-5 ${unlocked ? 'text-brand-600' : 'text-ink-faint'}`} />
                    <p className="mt-1.5 text-[11px] font-medium text-ink">{a.title}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={editing} onClose={() => setEditing(false)} title="Edit profile" description="Changes save to your account instantly.">
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Full name</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-username">Instagram username</Label>
            <Input id="edit-username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-bio">Bio</Label>
            <Textarea id="edit-bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short intro…" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>Save changes</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
