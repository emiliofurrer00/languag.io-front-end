'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  Flame,
  Globe,
  LoaderCircle,
  Lock,
  Settings,
  Sparkles,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { Label } from '@/components/ui/Label';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import type { ProfileAccentColor } from '@/lib/profile/types';
import { cn } from '@/lib/utils';

const STEPS = [
  { icon: User, label: 'Identity', title: 'Who are you?' },
  { icon: FileText, label: 'Tagline', title: 'Describe yourself' },
  { icon: BookOpen, label: 'About', title: 'Tell us more' },
  { icon: Settings, label: 'Preferences', title: 'Set your preferences' },
] as const;

const AVATAR_COLORS = [
  { name: 'coral', className: 'bg-neo-coral', label: 'Coral' },
  { name: 'teal', className: 'bg-neo-teal', label: 'Teal' },
  { name: 'magenta', className: 'bg-neo-magenta', label: 'Magenta' },
  { name: 'blue', className: 'bg-neo-blue', label: 'Blue' },
  { name: 'yellow', className: 'bg-neo-yellow', label: 'Yellow' },
] as const;

type AvatarColor = (typeof AVATAR_COLORS)[number]['name'];

type OnboardingData = {
  username: string;
  displayName: string;
  avatarColor: ProfileAccentColor | AvatarColor;
  tagline: string;
  aboutMe: string;
  isPublicProfile: boolean;
  soundsEnabled: boolean;
  dailyGoal: number;
};

type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

type OnboardingFlowProps = {
  initialData: OnboardingData;
  nextPath?: string | null;
};

type ApiErrorPayload = {
  message?: string;
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
} | null;

function readApiErrorMessage(payload: ApiErrorPayload, fallback: string) {
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

export default function OnboardingFlow({ initialData, nextPath }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>(
    initialData.username.trim().length >= 3 ? 'available' : 'idle'
  );
  const [usernameMessage, setUsernameMessage] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialUsername = initialData.username.trim().toLowerCase();
  const normalizedUsername = data.username.trim().toLowerCase();
  const isUsingInitialUsername =
    normalizedUsername.length >= 3 && normalizedUsername === initialUsername;
  const currentColor = AVATAR_COLORS.find((color) => color.name === data.avatarColor);
  const initials = data.displayName
    ? data.displayName
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  useEffect(() => {
    if (currentStep !== 0) {
      return;
    }

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
        const payload = (await response.json().catch(() => null)) as
          | {
              available?: boolean;
              message?: string;
              detail?: string;
              title?: string;
              errors?: Record<string, string[]>;
            }
          | null;

        if (!response.ok) {
          throw new Error(
            readApiErrorMessage(payload, 'Unable to check username availability.')
          );
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
  }, [currentStep, isUsingInitialUsername, normalizedUsername]);

  const canProceed = useMemo(() => {
    if (currentStep !== 0) {
      return true;
    }

    return (
      data.displayName.trim().length >= 1 &&
      normalizedUsername.length >= 3 &&
      (isUsingInitialUsername || usernameStatus === 'available')
    );
  }, [
    currentStep,
    data.displayName,
    isUsingInitialUsername,
    normalizedUsername.length,
    usernameStatus,
  ]);

  const updateData = (nextData: Partial<OnboardingData>) =>
    setData((current) => ({ ...current, ...nextData }));

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }

    setIsSaving(true);
    setSubmissionError(null);

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: normalizedUsername,
          name: data.displayName.trim(),
          hasBeenOnboarded: true,
          dailyCardsGoal: data.dailyGoal,
          profileDescription: data.tagline.trim(),
          about: data.aboutMe.trim(),
          isPublicProfile: data.isPublicProfile,
        }),
      });

      const payload = (await response.json().catch(() => null)) as ApiErrorPayload;

      if (!response.ok) {
        throw new Error(readApiErrorMessage(payload, 'Unable to save your onboarding details.'));
      }

      router.push(nextPath ?? '/decks');
      router.refresh();
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : 'Unable to save your onboarding details.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b-[3px] border-foreground bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="flex items-center gap-2 font-display text-xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            Set up your profile
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {`Step ${currentStep + 1} of ${STEPS.length}`}
          </span>
        </div>
      </header>

      <div className="h-2 w-full border-b-[2px] border-foreground/10 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center gap-2 sm:gap-4">
          {STEPS.map((step, index) => (
            <button
              key={step.label}
              type="button"
              onClick={() => index <= currentStep && setCurrentStep(index)}
              className={cn(
                'flex items-center gap-2 rounded-full border-[2px] px-3 py-2 text-sm font-semibold transition-all',
                index === currentStep
                  ? 'border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))]'
                  : index < currentStep
                    ? 'cursor-pointer border-foreground bg-neo-teal text-foreground'
                    : 'border-foreground/20 text-muted-foreground'
              )}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <step.icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto flex flex-1 items-start justify-center px-4 pb-8">
        <div className="w-full max-w-lg">
          <h1 className="mb-8 text-center font-display text-3xl font-bold">
            {STEPS[currentStep].title}
          </h1>

          {currentStep === 0 ? (
            <NeoCard className="space-y-6 p-8">
              <div className="flex justify-center">
                <div
                  className={cn(
                    'flex h-28 w-28 items-center justify-center rounded-2xl border-[3px] border-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-colors',
                    currentColor?.className ?? 'bg-neo-teal'
                  )}
                >
                  <span className="font-display text-4xl font-bold">{initials}</span>
                </div>
              </div>

              <div>
                <Label className="font-display text-sm font-semibold">Display Name *</Label>
                <input
                  value={data.displayName}
                  onChange={(event) => updateData({ displayName: event.target.value })}
                  placeholder="Alex Learner"
                  className="mt-1.5 w-full rounded-xl border-[2px] border-foreground bg-background px-4 py-3"
                  maxLength={40}
                />
              </div>

              <div>
                <Label className="font-display text-sm font-semibold">Username *</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">
                    @
                  </span>
                  <input
                    value={data.username}
                    onChange={(event) =>
                      updateData({
                        username: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                      })
                    }
                    placeholder="alexlearner"
                    className="w-full rounded-xl border-[2px] border-foreground bg-background py-3 pl-8 pr-4"
                    maxLength={20}
                  />
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
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

              <div>
                <Label className="font-display text-sm font-semibold">Avatar Color</Label>
                <div className="mt-2 flex gap-3">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => updateData({ avatarColor: color.name })}
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl border-[2px] transition-all',
                        color.className,
                        data.avatarColor === color.name
                          ? 'scale-110 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))]'
                          : 'border-foreground/30 hover:scale-105 hover:border-foreground'
                      )}
                      title={color.label}
                    >
                      {data.avatarColor === color.name ? <Check className="h-5 w-5" /> : null}
                    </button>
                  ))}
                </div>
              </div>
            </NeoCard>
          ) : null}

          {currentStep === 1 ? (
            <NeoCard className="space-y-6 p-8">
              <div className="mb-2 text-center">
                <p className="text-sm text-muted-foreground">
                  A short tagline that appears below your name. Keep it punchy.
                </p>
              </div>

              <div>
                <Label className="font-display text-sm font-semibold">Short Description</Label>
                <input
                  value={data.tagline}
                  onChange={(event) => updateData({ tagline: event.target.value })}
                  placeholder="Language enthusiast and lifelong learner"
                  className="mt-1.5 w-full rounded-xl border-[2px] border-foreground bg-background px-4 py-3"
                  maxLength={80}
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">{`${data.tagline.length}/80`}</p>
              </div>

              <div className="rounded-xl border-[2px] border-foreground/20 bg-muted/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Preview
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg border-[2px] border-foreground text-sm font-bold',
                      currentColor?.className ?? 'bg-neo-teal'
                    )}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold">
                      {data.displayName || 'Your Name'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.tagline || 'Your tagline will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            </NeoCard>
          ) : null}

          {currentStep === 2 ? (
            <NeoCard className="space-y-6 p-8">
              <div className="mb-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Optional - tell the community a bit more about yourself, your interests, or what
                  you are learning.
                </p>
              </div>

              <div>
                <Label className="font-display text-sm font-semibold">About Me</Label>
                <textarea
                  value={data.aboutMe}
                  onChange={(event) => updateData({ aboutMe: event.target.value })}
                  placeholder="I am a software developer who loves learning new languages. Currently studying Spanish and brushing up on my Japanese."
                  className="mt-1.5 min-h-[140px] w-full rounded-xl border-[2px] border-foreground bg-background px-4 py-3"
                  maxLength={500}
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">{`${data.aboutMe.length}/500`}</p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span>You can always update this later in your profile settings.</span>
              </div>
            </NeoCard>
          ) : null}

          {currentStep === 3 ? (
            <NeoCard className="space-y-6 p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-foreground bg-neo-blue shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                    {data.isPublicProfile ? (
                      <Globe className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold">Profile Visibility</p>
                    <p className="text-xs text-muted-foreground">
                      {data.isPublicProfile
                        ? 'Anyone can see your profile'
                        : 'Only you can see your profile'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={data.isPublicProfile}
                  onCheckedChange={(checked) => updateData({ isPublicProfile: checked })}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-foreground bg-neo-magenta shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                    {data.soundsEnabled ? (
                      <Volume2 className="h-5 w-5" />
                    ) : (
                      <VolumeX className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold">Sound Effects</p>
                    <p className="text-xs text-muted-foreground">
                      {data.soundsEnabled
                        ? 'Play sounds for correct answers and streaks'
                        : 'All sounds muted'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={data.soundsEnabled}
                  onCheckedChange={(checked) => updateData({ soundsEnabled: checked })}
                />
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-foreground bg-neo-coral shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold">Daily Card Goal</p>
                    <p className="text-xs text-muted-foreground">
                      How many cards per day to keep your streak
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border-[2px] border-foreground/20 bg-muted/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cards per day</span>
                    <span className="rounded-full border-[2px] border-foreground bg-neo-yellow px-4 py-1 font-display text-2xl font-bold shadow-[2px_2px_0_0_hsl(var(--foreground))]">
                      {data.dailyGoal}
                    </span>
                  </div>
                  <Slider
                    value={[data.dailyGoal]}
                    onValueChange={(value) => updateData({ dailyGoal: value[0] ?? data.dailyGoal })}
                    min={5}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>5 (casual)</span>
                    <span>50 (serious)</span>
                    <span>100 (intense)</span>
                  </div>
                </div>
              </div>
            </NeoCard>
          ) : null}

          {submissionError ? (
            <p className="mt-6 rounded-xl border-[2px] border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {submissionError}
            </p>
          ) : null}

          <div className="mt-8 flex justify-between">
            {currentStep > 0 ? (
              <NeoButton variant="outline" onClick={handleBack} type="button" disabled={isSaving}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </NeoButton>
            ) : (
              <div />
            )}

            <NeoButton
              variant={currentStep === STEPS.length - 1 ? 'success' : 'primary'}
              onClick={() => {
                void handleNext();
              }}
              type="button"
              disabled={!canProceed || isSaving || usernameStatus === 'checking'}
              className={!canProceed || isSaving ? 'cursor-not-allowed opacity-50' : ''}
            >
              {isSaving ? (
                <>
                  Saving
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </>
              ) : currentStep === STEPS.length - 1 ? (
                <>
                  Let&apos;s Go!
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </NeoButton>
          </div>
        </div>
      </div>
    </div>
  );
}
