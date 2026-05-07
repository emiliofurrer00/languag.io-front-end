'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlignLeft,
  ArrowLeft,
  AtSign,
  Check,
  Flame,
  Globe,
  LoaderCircle,
  Lock,
  Palette,
  Save,
  UserRound,
} from 'lucide-react';

import { ProfilePictureUploader } from '@/components/profile/ProfilePictureUploader';
import { Label } from '@/components/ui/Label';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { toast } from '@/hooks/useToast';
import { updateMyProfile } from '@/lib/profile/client';
import type { ProfileAccentColor, ProfileData } from '@/lib/profile/types';
import { cn } from '@/lib/utils';

const AVATAR_COLORS = [
  { name: 'coral', className: 'bg-neo-coral', label: 'Coral' },
  { name: 'teal', className: 'bg-neo-teal', label: 'Teal' },
  { name: 'magenta', className: 'bg-neo-magenta', label: 'Magenta' },
  { name: 'blue', className: 'bg-neo-blue', label: 'Blue' },
  { name: 'yellow', className: 'bg-neo-yellow', label: 'Yellow' },
] as const satisfies ReadonlyArray<{
  name: ProfileAccentColor;
  className: string;
  label: string;
}>;

type ProfileEditData = {
  username: string;
  displayName: string;
  avatarColor: ProfileAccentColor;
  tagline: string;
  about: string;
  isPublicProfile: boolean;
  dailyGoal: number;
};

type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

type AvailabilityPayload = {
  available?: boolean;
  message?: string;
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
} | null;

const inputClassName =
  'mt-1.5 w-full rounded-xl border-[2px] border-foreground bg-background px-4 py-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function readApiErrorMessage(payload: AvailabilityPayload, fallback: string) {
  if (!payload) {
    return fallback;
  }

  const validationMessage = payload.errors
    ? Object.values(payload.errors)
        .flat()
        .find((message) => typeof message === 'string' && message.trim())
    : undefined;

  return payload.message || payload.detail || validationMessage || payload.title || fallback;
}

function normalizeUsername(value?: string) {
  return (value ?? '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '');
}

function clampDailyGoal(value: number) {
  if (!Number.isFinite(value)) {
    return 15;
  }

  return Math.min(100, Math.max(5, Math.round(value)));
}

function buildInitials(name: string, fallback: string) {
  const parts = name
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return fallback || '?';
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .toUpperCase();
}

function createInitialData(profile: ProfileData): ProfileEditData {
  return {
    username: normalizeUsername(profile.username ?? profile.handle),
    displayName: profile.name ?? '',
    avatarColor: profile.avatarColor,
    tagline: profile.tagline ?? '',
    about: profile.about ?? profile.bio ?? '',
    isPublicProfile: profile.isPublicProfile ?? true,
    dailyGoal:
      profile.dailyCardsGoal && profile.dailyCardsGoal > 0
        ? clampDailyGoal(profile.dailyCardsGoal)
        : 15,
  };
}

export function ProfileEditForm({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const initialData = React.useMemo(() => createInitialData(profile), [profile]);
  const [data, setData] = React.useState<ProfileEditData>(initialData);
  const [usernameStatus, setUsernameStatus] = React.useState<UsernameStatus>(
    initialData.username.length >= 3 ? 'available' : 'idle'
  );
  const [usernameMessage, setUsernameMessage] = React.useState(
    initialData.username.length >= 3 ? 'This is your current username.' : ''
  );
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const initialUsername = initialData.username.toLowerCase();
  const normalizedUsername = data.username.trim().toLowerCase();
  const isUsingInitialUsername =
    normalizedUsername.length >= 3 && normalizedUsername === initialUsername;
  const currentColor = AVATAR_COLORS.find((color) => color.name === data.avatarColor);
  const initials = buildInitials(data.displayName, profile.initials);
  const previewProfile = React.useMemo(
    () => ({
      ...profile,
      name: data.displayName.trim() || profile.name,
      initials,
      avatarColor: data.avatarColor,
    }),
    [data.avatarColor, data.displayName, initials, profile]
  );

  React.useEffect(() => {
    if (normalizedUsername.length < 3) {
      setUsernameStatus('idle');
      setUsernameMessage('');
      return;
    }

    if (isUsingInitialUsername) {
      setUsernameStatus('available');
      setUsernameMessage('This is your current username.');
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setUsernameStatus('checking');
      setUsernameMessage('Checking availability...');

      try {
        const response = await fetch(
          `/api/users/username-availability?username=${encodeURIComponent(normalizedUsername)}`,
          {
            cache: 'no-store',
          }
        );
        const payload = (await response.json().catch(() => null)) as AvailabilityPayload;

        if (!response.ok) {
          throw new Error(readApiErrorMessage(payload, 'Unable to check username availability.'));
        }

        if (cancelled) {
          return;
        }

        if (payload?.available) {
          setUsernameStatus('available');
          setUsernameMessage('Username is available.');
          return;
        }

        setUsernameStatus('unavailable');
        setUsernameMessage('That username is already taken.');
      } catch (error) {
        if (cancelled) {
          return;
        }

        setUsernameStatus('error');
        setUsernameMessage(
          error instanceof Error ? error.message : 'Unable to check username availability.'
        );
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [isUsingInitialUsername, normalizedUsername]);

  const canSave = React.useMemo(() => {
    return (
      data.displayName.trim().length >= 1 &&
      normalizedUsername.length >= 3 &&
      usernameStatus === 'available'
    );
  }, [data.displayName, normalizedUsername.length, usernameStatus]);

  const updateData = (nextData: Partial<ProfileEditData>) => {
    setData((current) => ({ ...current, ...nextData }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave || isSaving) {
      return;
    }

    setIsSaving(true);
    setSubmissionError(null);

    try {
      await updateMyProfile({
        username: normalizedUsername,
        name: data.displayName.trim(),
        hasBeenOnboarded: true,
        dailyCardsGoal: data.dailyGoal,
        profileDescription: data.tagline.trim(),
        about: data.about.trim(),
        isPublicProfile: data.isPublicProfile,
        avatarColor: data.avatarColor,
      });

      toast({
        title: 'Profile updated',
        description: 'Your changes are live on your profile.',
      });
      router.push('/profile/me');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update your profile.';
      setSubmissionError(message);
      toast({
        title: 'Could not save profile',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-muted-foreground">
            Profile settings
          </p>
          <h1 className="font-display text-3xl font-bold">Edit profile</h1>
        </div>
        <Link
          href="/profile/me"
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-secondary px-4 py-2 font-display text-sm font-semibold transition-all',
            'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          View Profile
        </Link>
      </div>

      <form onSubmit={(event) => void handleSubmit(event)} className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <NeoCard className="h-fit space-y-6 p-6">
          <ProfilePictureUploader profile={previewProfile} />

          <div className="rounded-xl border-[2px] border-foreground/20 bg-muted/50 p-4">
            <div
              className={cn(
                'mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]',
                currentColor?.className ?? 'bg-neo-teal'
              )}
            >
              <span className="font-display text-xl font-bold">{initials}</span>
            </div>
            <p className="font-display text-base font-bold">{data.displayName || 'Your name'}</p>
            <p className="truncate text-sm text-muted-foreground">
              @{normalizedUsername || 'username'}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <Label className="font-display text-sm font-semibold">Avatar Color</Label>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  aria-label={`Use ${color.label} avatar color`}
                  title={color.label}
                  onClick={() => updateData({ avatarColor: color.name })}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border-[2px] transition-all',
                    color.className,
                    data.avatarColor === color.name
                      ? 'scale-105 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))]'
                      : 'border-foreground/30 hover:scale-105 hover:border-foreground'
                  )}
                >
                  {data.avatarColor === color.name ? <Check className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          </div>
        </NeoCard>

        <div className="space-y-6">
          <NeoCard className="space-y-5 p-6">
            <div className="flex items-center gap-2">
              <UserRound className="h-5 w-5" />
              <h2 className="font-display text-xl font-bold">Identity</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="displayName" className="font-display text-sm font-semibold">
                  Display Name *
                </Label>
                <input
                  id="displayName"
                  value={data.displayName}
                  onChange={(event) => updateData({ displayName: event.target.value })}
                  placeholder="Alex Learner"
                  className={inputClassName}
                  maxLength={40}
                />
              </div>

              <div>
                <Label htmlFor="username" className="font-display text-sm font-semibold">
                  Username *
                </Label>
                <div className="relative mt-1.5">
                  <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="username"
                    value={data.username}
                    onChange={(event) =>
                      updateData({ username: normalizeUsername(event.target.value) })
                    }
                    placeholder="alexlearner"
                    className={cn(inputClassName, 'mt-0 pl-9')}
                    maxLength={20}
                  />
                </div>
                <div className="mt-1 flex min-h-4 items-center gap-2 text-xs">
                  {usernameStatus === 'checking' ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  <p
                    className={cn(
                      'text-muted-foreground',
                      usernameStatus === 'available' ? 'text-emerald-700' : null,
                      usernameStatus === 'unavailable' || usernameStatus === 'error'
                        ? 'text-destructive'
                        : null
                    )}
                  >
                    {usernameMessage ||
                      `${data.username.length}/20 - letters, numbers, underscores only`}
                  </p>
                </div>
              </div>
            </div>
          </NeoCard>

          <NeoCard className="space-y-5 p-6">
            <div className="flex items-center gap-2">
              <AlignLeft className="h-5 w-5" />
              <h2 className="font-display text-xl font-bold">Bio</h2>
            </div>

            <div>
              <Label htmlFor="tagline" className="font-display text-sm font-semibold">
                Short Description
              </Label>
              <input
                id="tagline"
                value={data.tagline}
                onChange={(event) => updateData({ tagline: event.target.value })}
                placeholder="Language enthusiast and lifelong learner"
                className={inputClassName}
                maxLength={80}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">{`${data.tagline.length}/80`}</p>
            </div>

            <div>
              <Label htmlFor="about" className="font-display text-sm font-semibold">
                About
              </Label>
              <textarea
                id="about"
                value={data.about}
                onChange={(event) => updateData({ about: event.target.value })}
                placeholder="What are you learning? What do you like practicing?"
                className={cn(inputClassName, 'min-h-[150px] resize-y')}
                maxLength={500}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">{`${data.about.length}/500`}</p>
            </div>
          </NeoCard>

          <NeoCard className="space-y-6 p-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              <h2 className="font-display text-xl font-bold">Preferences</h2>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border-[2px] border-foreground/20 bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-foreground bg-neo-blue shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                  {data.isPublicProfile ? (
                    <Globe className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="profileVisibility"
                    className="font-display text-sm font-semibold"
                  >
                    Public Profile
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {data.isPublicProfile ? 'Visible to other learners' : 'Only visible to you'}
                  </p>
                </div>
              </div>
              <Switch
                id="profileVisibility"
                checked={data.isPublicProfile}
                onCheckedChange={(checked) => updateData({ isPublicProfile: checked })}
              />
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-foreground bg-neo-coral shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <Label htmlFor="dailyGoal" className="font-display text-sm font-semibold">
                    Daily Card Goal
                  </Label>
                  <p className="text-xs text-muted-foreground">Cards per day</p>
                </div>
              </div>

              <div className="grid gap-4 rounded-xl border-[2px] border-foreground/20 bg-muted/50 p-4 md:grid-cols-[1fr_96px] md:items-center">
                <Slider
                  value={[data.dailyGoal]}
                  onValueChange={(value) =>
                    updateData({ dailyGoal: clampDailyGoal(value[0] ?? data.dailyGoal) })
                  }
                  min={5}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <input
                  id="dailyGoal"
                  type="number"
                  min={5}
                  max={100}
                  step={5}
                  value={data.dailyGoal}
                  onChange={(event) =>
                    updateData({ dailyGoal: clampDailyGoal(Number(event.target.value)) })
                  }
                  className="w-full rounded-xl border-[2px] border-foreground bg-background px-3 py-2 text-center font-display text-xl font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </NeoCard>

          {submissionError ? (
            <p className="rounded-xl border-[2px] border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {submissionError}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/profile/me"
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-transparent px-4 py-2 font-display font-semibold transition-all',
                'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-muted hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
            >
              Cancel
            </Link>
            <NeoButton
              type="submit"
              variant="success"
              disabled={!canSave || isSaving || usernameStatus === 'checking'}
              className={!canSave || isSaving ? 'cursor-not-allowed opacity-50' : ''}
            >
              {isSaving ? (
                <>
                  Saving
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Save Changes
                  <Save className="h-4 w-4" />
                </>
              )}
            </NeoButton>
          </div>
        </div>
      </form>
    </main>
  );
}
