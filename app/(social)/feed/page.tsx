import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Crown,
  Flame,
  Heart,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  UserPlus,
  Zap,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import Navbar from '@/components/profile/Navbar';
import { ProfileFriendshipActions } from '@/components/social/ProfileFriendshipActions';
import { SocialAvatar } from '@/components/social/SocialAvatar';
import { AppStatePanel, stateActionClassName } from '@/components/ui/AppStatePanel';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { Progress } from '@/components/ui/Progress';
import { buildLoginRedirectPath, buildOnboardingPath } from '@/lib/auth-flow';
import { getFeed } from '@/lib/feed/server';
import { buildProfilePath } from '@/lib/profile/paths';
import { getMyProfile } from '@/lib/profile/server';
import { cn } from '@/lib/utils';

const inlineLinkClassName =
  'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground px-4 py-2 text-sm font-semibold font-display shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const feedAccentColors = [
  'bg-neo-yellow',
  'bg-neo-teal',
  'bg-neo-magenta',
  'bg-neo-blue',
  'bg-neo-coral',
];

// TODO: Replace with API-provided browse categories when feed personalization supports them.
const browseCategories = ['Languages', 'Programming', 'Science', 'History', 'Math', 'Music', 'Art'];

// TODO: Replace with real XP/rank/league-season fields once the feed API exposes gamification stats.
const placeholderXp = 0;
const placeholderXpToday = 0;
const placeholderLeagueRank = 'Top 8%';
const placeholderLeagueTimeLeft = '3 days left';

type FeedActivityIcon = ComponentType<{ className?: string }>;

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'there';
}

function formatToday() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());
}

function getActivityIcon(action: string): FeedActivityIcon {
  const normalizedAction = action.toLowerCase();

  if (normalizedAction.includes('streak')) {
    return Flame;
  }

  if (normalizedAction.includes('master')) {
    return Trophy;
  }

  if (normalizedAction.includes('created') || normalizedAction.includes('shipped')) {
    return Sparkles;
  }

  if (normalizedAction.includes('stud')) {
    return Zap;
  }

  return BookOpen;
}

function getActivityIconColor(index: number) {
  return feedAccentColors[(index + 1) % feedAccentColors.length];
}

function EmptySection({ title, description }: { title: string; description: string }) {
  return (
    <NeoCard className="p-5">
      <p className="font-display text-base font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </NeoCard>
  );
}

type SectionHeaderProps = {
  title: string;
  kicker: string;
  icon?: ReactNode;
  link?: { href: string; label: string };
};

function SectionHeader({ title, kicker, icon, link }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        {kicker}
      </p>
      <div className="flex items-end justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold leading-tight">
          {icon}
          {title}
        </h2>
        {link ? (
          <Link
            href={link.href}
            className="flex items-center gap-1 pb-1 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default async function Feed() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(buildLoginRedirectPath('/feed'));
  }

  const profile = await getMyProfile();

  if (!profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/feed'));
  }

  const feed = await getFeed();
  const fallbackDailyGoal = profile.dailyCardsGoal || 20;
  const dailyGoal = feed.dailyGoal.goal || fallbackDailyGoal;
  const dailyProgress = feed.dailyGoal.progress;
  const dailyGoalPercentage =
    feed.dailyGoal.percentage || (dailyGoal > 0 ? (dailyProgress / dailyGoal) * 100 : 0);
  const streak = feed.streak.current;
  const league = feed.summary.league ?? 'Soon';
  const today = formatToday();
  const firstName = getFirstName(profile.name);
  const isFirstUserFeed =
    feed.continueStudying.length === 0 &&
    feed.friendsActivity.length === 0 &&
    feed.suggestedDecks.length === 0 &&
    feed.suggestedPeople.length === 0 &&
    feed.summary.cards === 0 &&
    feed.summary.decks === 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-neo-magenta/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[46rem] -left-28 h-72 w-72 rounded-full bg-neo-teal/25 blur-3xl"
      />

      <Navbar title="Feed" />

      <main className="container relative mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:py-10">
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {today}
            </p>
            <span className="h-0.5 w-8 bg-foreground" />
          </div>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] text-foreground md:text-6xl">
            Hey, {firstName}.
            <br />
            <span className="text-muted-foreground">Ready to study?</span>
          </h1>
        </section>

        <section className="mb-8 grid grid-cols-6 gap-3">
          <NeoCard
            variant="yellow"
            className="relative col-span-6 overflow-hidden p-5 md:col-span-4"
          >
            <div
              aria-hidden="true"
              className="absolute -right-7 -top-7 h-24 w-24 rounded-full border-[3px] border-foreground bg-background/40"
            />
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
              Daily Goal
            </p>
            <div className="mb-3 flex items-end gap-2">
              <span className="font-display text-6xl font-bold leading-none">{dailyProgress}</span>
              <span className="pb-1 font-display text-xl font-bold opacity-60">/ {dailyGoal}</span>
            </div>
            <p className="mb-4 text-sm font-semibold opacity-80">cards reviewed today</p>
            <Progress
              value={dailyGoalPercentage}
              className="h-3 rounded-full border-[2px] border-foreground bg-background/60"
            />
            {feed.continueStudying[0] ? (
              <Link href={`/study/${feed.continueStudying[0].id}`}>
                <NeoButton
                  variant="dark"
                  size="sm"
                  className="mt-4 bg-foreground text-background hover:bg-foreground/90"
                >
                  Continue session
                  <ArrowUpRight className="h-4 w-4" />
                </NeoButton>
              </Link>
            ) : (
              <Link href="/decks">
                <NeoButton
                  variant="dark"
                  size="sm"
                  className="mt-4 bg-foreground text-background hover:bg-foreground/90"
                >
                  Find a deck
                  <ArrowUpRight className="h-4 w-4" />
                </NeoButton>
              </Link>
            )}
          </NeoCard>

          <NeoCard className="col-span-6 flex min-h-44 flex-col p-4 sm:col-span-3 md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <Flame className="h-5 w-5 text-neo-coral" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Streak
              </span>
            </div>
            <p className="font-display text-4xl font-bold leading-none">
              {streak}
              <span className="text-lg text-muted-foreground">d</span>
            </p>
            <div className="mt-auto grid grid-cols-7 gap-1 pt-3">
              {feed.streak.days.map((day, index) => {
                const isToday = !day.done && index === streak;

                return (
                  <div key={`${day.day}-${index}`} className="flex flex-col items-center gap-0.5">
                    <div
                      className={cn(
                        'flex aspect-square w-full items-center justify-center rounded-md border-[1.5px]',
                        day.done
                          ? 'border-foreground bg-neo-coral'
                          : isToday
                            ? 'border-dashed border-foreground bg-neo-yellow'
                            : 'border-foreground/20 bg-secondary'
                      )}
                    >
                      {day.done ? <Zap className="h-2 w-2" /> : null}
                    </div>
                    <span className="text-[7px] font-bold text-muted-foreground">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </NeoCard>

          <NeoCard variant="magenta" size="sm" className="relative col-span-3 p-4 md:col-span-2">
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-2 rounded-md border-[2px] border-foreground bg-neo-yellow px-2 py-0.5 font-display text-[9px] font-bold uppercase shadow-[2px_2px_0_0_hsl(var(--foreground))] rotate-6"
            >
              {placeholderLeagueRank}
            </span>
            <Crown className="mb-2 h-5 w-5" />
            <p className="font-display text-2xl font-bold leading-none">{league}</p>
            <p className="mt-1 text-[10px] font-semibold opacity-70">
              League - {placeholderLeagueTimeLeft}
            </p>
          </NeoCard>

          <NeoCard variant="teal" size="sm" className="col-span-3 p-4 md:col-span-2">
            <Zap className="mb-2 h-5 w-5" />
            <p className="font-display text-2xl font-bold leading-none">{placeholderXp}</p>
            <p className="mt-1 text-[10px] font-semibold opacity-70">
              XP - +{placeholderXpToday} today
            </p>
          </NeoCard>

          <NeoCard variant="blue" size="sm" className="col-span-6 p-4 md:col-span-2">
            <TrendingUp className="mb-2 h-5 w-5" />
            <p className="font-display text-2xl font-bold leading-none">{feed.summary.cards}</p>
            <p className="mt-1 text-[10px] font-semibold opacity-70">Cards studied</p>
          </NeoCard>
        </section>

        {isFirstUserFeed ? (
          <section className="mb-8">
            <AppStatePanel
              icon={Sparkles}
              tone="success"
              kicker="First loop"
              title={`Welcome in, ${firstName}`}
              description="Create or study one deck and this feed will start filling with progress, suggestions, and people to follow."
            >
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/decks/editor/new"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <BookOpen className="h-4 w-4" />
                  New deck
                </Link>
                <Link href="/decks" className={stateActionClassName}>
                  Browse decks
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </AppStatePanel>
          </section>
        ) : null}

        {feed.continueStudying.length > 0 ? (
          <section className="mb-8">
            <SectionHeader
              title="Pick up where you left off"
              kicker="01 / Continue"
              link={{ href: '/decks', label: 'All decks' }}
            />
            <div className="space-y-3">
              {feed.continueStudying.map((deck, index) => (
                <Link key={deck.id} href={`/study/${deck.id}`} className="block">
                  <NeoCard
                    size="sm"
                    className="cursor-pointer p-4 transition-transform hover:-translate-y-1 hover:translate-x-1"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-16 w-14 shrink-0 -rotate-3 items-center justify-center rounded-lg border-[2px] border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))]',
                          deck.color || feedAccentColors[index % feedAccentColors.length]
                        )}
                      >
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center gap-2">
                          <p className="truncate font-display text-base font-bold">{deck.title}</p>
                          <span className="rounded-full border border-foreground bg-neo-yellow px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            {deck.lastStudied}
                          </span>
                        </div>
                        <p className="mb-1.5 text-xs text-muted-foreground">{deck.cards} cards</p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={deck.progress}
                            className="h-2 flex-1 rounded-full border border-foreground/30"
                          />
                          <span className="font-display text-xs font-bold">
                            {Math.round(deck.progress)}%
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </div>
                  </NeoCard>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="-mx-4 mb-8 lg:-mx-8">
          <div className="mb-3 flex items-center gap-2 px-4 lg:px-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Browse
            </span>
            <span className="h-px flex-1 bg-foreground/15" />
          </div>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-2 lg:px-8">
            {browseCategories.map((category, index) => (
              <span
                key={category}
                className={cn(
                  'shrink-0 rounded-full border-[2px] border-foreground px-4 py-2 font-display text-sm font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))]',
                  feedAccentColors[index % feedAccentColors.length]
                )}
              >
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <SectionHeader
            title="What your friends are up to"
            kicker="02 / Activity"
            icon={<Heart className="h-4 w-4 fill-neo-coral text-neo-coral" />}
          />
          {feed.friendsActivity.length > 0 ? (
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute bottom-3 left-[18px] top-3 w-0.5 bg-foreground/15"
              />
              <div className="space-y-4">
                {feed.friendsActivity.map((item, index) => {
                  const ActivityIcon = getActivityIcon(item.action);
                  const profilePath = buildProfilePath(item.username);

                  return (
                    <div
                      key={`${item.userId}-${item.occurredAtUtc} ${item.action}`}
                      className="flex gap-4"
                    >
                      <div
                        className={cn(
                          'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                          getActivityIconColor(index)
                        )}
                      >
                        <ActivityIcon className="h-4 w-4" />
                      </div>
                      <NeoCard size="sm" className="flex-1 p-4">
                        <div className="flex items-start gap-3">
                          {profilePath ? (
                            <Link
                              href={profilePath}
                              aria-label={`View ${item.user}'s profile`}
                              className="group -m-2 flex min-w-0 flex-1 items-start gap-3 rounded-2xl p-2 transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
                            >
                              <SocialAvatar
                                label={item.user}
                                imageUrl={item.profilePictureUrl}
                                fallbackClassName={item.color}
                                className="h-9 w-9 rounded-xl text-[10px] shadow-[2px_2px_0_0_hsl(var(--foreground))]"
                                sizes="36px"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm leading-snug">
                                  <span className="font-bold transition-colors group-hover:text-primary group-hover:underline">
                                    {item.user}
                                  </span>{' '}
                                  <span className="text-muted-foreground">{item.action}</span>{' '}
                                  {item.target ? (
                                    <span className="font-display font-bold">{item.target}</span>
                                  ) : null}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-semibold text-muted-foreground">
                                    {item.time}
                                  </span>
                                  <span className="rounded-full border border-foreground/30 bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                    Friend
                                  </span>
                                  {item.followsYou && !item.isFollowing ? (
                                    <span className="rounded-full border border-foreground/30 bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                      Follows you
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <SocialAvatar
                                label={item.user}
                                imageUrl={item.profilePictureUrl}
                                fallbackClassName={item.color}
                                className="h-9 w-9 rounded-xl text-[10px] shadow-[2px_2px_0_0_hsl(var(--foreground))]"
                                sizes="36px"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm leading-snug">
                                  <span className="font-bold">{item.user}</span>{' '}
                                  <span className="text-muted-foreground">{item.action}</span>{' '}
                                  {item.target ? (
                                    <span className="font-display font-bold">{item.target}</span>
                                  ) : null}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-semibold text-muted-foreground">
                                    {item.time}
                                  </span>
                                  <span className="rounded-full border border-foreground/30 bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                                    Friend
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          {profilePath ? (
                            <Link
                              href={profilePath}
                              className={cn(
                                inlineLinkClassName,
                                'bg-accent px-3 py-1.5 text-xs text-accent-foreground'
                              )}
                            >
                              View
                            </Link>
                          ) : null}
                        </div>
                        {/* TODO: Add real like/comment controls here when activity reactions are available from the API. */}
                      </NeoCard>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptySection
              title="Your feed will warm up soon"
              description="Once your friends create decks and study, their latest activity will show up here."
            />
          )}
        </section>

        <section className="mb-8">
          <SectionHeader
            title="Picked for you"
            kicker="03 / Discover"
            icon={<Star className="h-4 w-4 fill-primary text-primary" />}
          />
          {feed.suggestedDecks.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {feed.suggestedDecks.map((deck, index) => (
                <Link key={deck.id} href={`/decks/${deck.id}`} className="group block">
                  <NeoCard
                    size="sm"
                    className={cn(
                      'h-full cursor-pointer p-4 transition-transform group-hover:-translate-y-1',
                      deck.color || feedAccentColors[index % feedAccentColors.length]
                    )}
                  >
                    <BookOpen className="mb-2 h-7 w-7" />
                    <p className="font-display text-sm font-bold leading-tight">{deck.title}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase opacity-70">
                      {deck.category}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t-2 border-foreground/20 pt-3">
                      <span className="text-[10px] font-bold uppercase opacity-70">
                        {deck.cards} cards
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-12" />
                    </div>
                  </NeoCard>
                </Link>
              ))}
            </div>
          ) : (
            <EmptySection
              title="No deck recommendations yet"
              description="Public decks from other learners will start appearing here as the library grows."
            />
          )}
        </section>

        <section className="mb-8">
          <SectionHeader
            title="People worth following"
            kicker="04 / Friends"
            icon={<UserPlus className="h-4 w-4 text-primary" />}
          />
          {feed.suggestedPeople.length > 0 ? (
            <NeoCard className="divide-y-[2px] divide-foreground/10 p-0">
              {feed.suggestedPeople.map((person) => {
                const profilePath = buildProfilePath(person.username);

                return (
                  <div key={person.userId} className="flex items-center gap-3 p-4">
                    <SocialAvatar
                      label={person.name}
                      imageUrl={person.profilePictureUrl}
                      fallbackClassName={person.color}
                      className="h-11 w-11 rounded-xl text-xs shadow-[2px_2px_0_0_hsl(var(--foreground))]"
                      sizes="44px"
                    />
                    <div className="min-w-0 flex-1">
                      {profilePath ? (
                        <Link
                          href={profilePath}
                          className="block truncate text-sm font-bold hover:underline"
                        >
                          {person.name}
                        </Link>
                      ) : (
                        <p className="truncate text-sm font-bold">{person.name}</p>
                      )}
                      <p className="truncate text-[11px] text-muted-foreground">
                        @{person.handle} - {person.bio}
                      </p>
                    </div>
                    <ProfileFriendshipActions
                      otherUserId={person.userId}
                      size="sm"
                      className="min-w-[118px]"
                    />
                  </div>
                );
              })}
            </NeoCard>
          ) : (
            <EmptySection
              title="No suggestions right now"
              description="As more people publish public profiles, we'll surface new learners you may want to connect with."
            />
          )}
        </section>

        <section className="pb-10">
          <Link href="/decks/editor/new" className="block">
            <NeoCard
              variant="teal"
              className="relative cursor-pointer overflow-hidden p-8 transition-transform hover:-translate-y-1 hover:translate-x-1"
            >
              <span
                aria-hidden="true"
                className="absolute -left-4 -top-4 h-20 w-20 rounded-full border-[3px] border-foreground bg-neo-magenta"
              />
              <span className="absolute right-6 top-4 rounded-md border-[2px] border-foreground bg-neo-yellow px-3 py-1 font-display text-[10px] font-bold uppercase shadow-[2px_2px_0_0_hsl(var(--foreground))] rotate-6">
                AI-powered
              </span>
              <div className="relative">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">
                  Your turn
                </p>
                <h3 className="mb-2 font-display text-3xl font-bold leading-tight">
                  Build a deck
                  <br />
                  the world will love.
                </h3>
                <p className="mb-4 max-w-sm text-sm opacity-80">
                  Generate flashcards from a prompt, or craft the set yourself.
                </p>
                <NeoButton variant="dark" size="sm" className="bg-foreground text-background">
                  Start creating
                  <ArrowUpRight className="h-4 w-4" />
                </NeoButton>
              </div>
            </NeoCard>
          </Link>
        </section>
      </main>
    </div>
  );
}
