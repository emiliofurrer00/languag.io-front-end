import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  BookOpen,
  ChevronRight,
  Crown,
  Flame,
  Heart,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import Navbar from '@/components/profile/Navbar';
import { ProfileFriendshipActions } from '@/components/social/ProfileFriendshipActions';
import { SocialAvatar } from '@/components/social/SocialAvatar';
import { NeoCard } from '@/components/ui/NeoCard';
import { Progress } from '@/components/ui/Progress';
import { buildLoginRedirectPath, buildOnboardingPath } from '@/lib/auth-flow';
import { getFeed } from '@/lib/feed/server';
import { buildProfilePath } from '@/lib/profile/paths';
import { getMyProfile } from '@/lib/profile/server';
import { cn } from '@/lib/utils';

const inlineLinkClassName =
  'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground px-4 py-2 text-sm font-semibold font-display shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]';

function EmptySection({ title, description }: { title: string; description: string }) {
  return (
    <NeoCard className="p-5">
      <p className="font-display text-base font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </NeoCard>
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
  const dailyGoal = feed.dailyGoal.goal;
  const dailyProgress = feed.dailyGoal.progress;
  const dailyGoalPercentage = feed.dailyGoal.percentage;
  const streak = feed.streak.current;
  const league = feed.summary.league;

  return (
    <div className="min-h-screen bg-background">
      <Navbar title="Feed" />
      <main className="container mx-auto max-w-2xl space-y-6 px-4 py-6">
        <NeoCard className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-foreground bg-primary shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold">Daily Goal</p>
                <p className="text-xs text-muted-foreground">
                  {dailyProgress}/{dailyGoal} cards today
                </p>
              </div>
            </div>
            <span className="font-display text-2xl font-bold text-primary">
              {Math.round(dailyGoalPercentage)}%
            </span>
          </div>
          <div className="relative">
            <Progress
              value={dailyGoalPercentage}
              className="h-4 rounded-full border-2 border-foreground bg-secondary"
            />
          </div>
        </NeoCard>

        <NeoCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-neo-coral" />
              <span className="font-display font-bold">{streak} day streak!</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Keep it up</span>
          </div>
          <div className="flex justify-between">
            {feed.streak.days.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all',
                    day.done
                      ? 'border-foreground bg-neo-teal shadow-[2px_2px_0_0_hsl(var(--foreground))]'
                      : 'border-foreground/30 bg-secondary'
                  )}
                >
                  {day.done ? (
                    <Zap className="h-4 w-4" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold',
                    day.done ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </NeoCard>

        <div className="grid grid-cols-3 gap-3">
          <NeoCard size="sm" className="p-3 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-foreground bg-neo-yellow shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <Crown className="h-4 w-4" />
            </div>
            <p className="font-display text-sm font-bold">{league ?? 'Soon'}</p>
            <p className="text-[10px] text-muted-foreground">League</p>
          </NeoCard>
          <NeoCard size="sm" className="p-3 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-foreground bg-neo-magenta shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <Layers className="h-4 w-4" />
            </div>
            <p className="font-display text-sm font-bold">{feed.summary.decks}</p>
            <p className="text-[10px] text-muted-foreground">Decks</p>
          </NeoCard>
          <NeoCard size="sm" className="p-3 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-foreground bg-neo-teal shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="font-display text-sm font-bold">{feed.summary.cards}</p>
            <p className="text-[10px] text-muted-foreground">Cards</p>
          </NeoCard>
        </div>

        {feed.continueStudying.length > 0 ? (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Continue Studying</h2>
              <Link
                href="/decks"
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                See all {'->'}
              </Link>
            </div>
            <div className="space-y-3">
              {feed.continueStudying.map((deck) => (
                <Link key={deck.id} href={`/study/${deck.id}`}>
                  <NeoCard
                    size="sm"
                    className="cursor-pointer p-4 transition-transform hover:-translate-y-1 hover:translate-x-1"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))]',
                          deck.color
                        )}
                      >
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-bold">{deck.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {deck.cards} cards - {deck.lastStudied}
                        </p>
                        <div className="mt-1.5">
                          <Progress
                            value={deck.progress}
                            className="h-2 rounded-full border border-foreground/30"
                          />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-display text-sm font-bold text-primary">
                          {deck.progress}%
                        </span>
                        <ChevronRight className="mx-auto mt-0.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </NeoCard>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <Heart className="h-4 w-4 text-neo-coral" />
            Friends Activity
          </h2>
          {feed.friendsActivity.length > 0 ? (
            <NeoCard className="divide-y-2 divide-foreground/10">
              {feed.friendsActivity.map((item) => {
                const profilePath = buildProfilePath(item.username);

                return (
                  <div
                    key={`${item.userId}-${item.occurredAtUtc}`}
                    className="flex items-start gap-3 p-4"
                  >
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
                          <p className="text-sm">
                            <span className="font-bold transition-colors group-hover:text-primary group-hover:underline">
                              {item.user}
                            </span>{' '}
                            <span className="text-muted-foreground">{item.action}</span>{' '}
                            {item.target ? (
                              <span className="font-semibold">{item.target}</span>
                            ) : null}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2">
                            <p className="text-[10px] text-muted-foreground">{item.time}</p>
                            <span className="rounded-full border border-foreground/30 bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                              Friend
                            </span>
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
                          <p className="text-sm">
                            <span className="font-bold">{item.user}</span>{' '}
                            <span className="text-muted-foreground">{item.action}</span>{' '}
                            {item.target ? (
                              <span className="font-semibold">{item.target}</span>
                            ) : null}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2">
                            <p className="text-[10px] text-muted-foreground">{item.time}</p>
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
                );
              })}
            </NeoCard>
          ) : (
            <EmptySection
              title="Your feed will warm up soon"
              description="Once your friends create decks and study, their latest activity will show up here."
            />
          )}
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <UserPlus className="h-4 w-4 text-primary" />
            Suggested Friends
          </h2>
          {feed.suggestedPeople.length > 0 ? (
            <NeoCard className="divide-y-2 divide-foreground/10">
              {feed.suggestedPeople.map((person) => {
                const profilePath = buildProfilePath(person.username);

                return (
                  <div key={person.userId} className="flex items-center gap-3 p-4">
                    <SocialAvatar
                      label={person.name}
                      imageUrl={person.profilePictureUrl}
                      fallbackClassName={person.color}
                      className="h-10 w-10 rounded-xl text-xs shadow-[2px_2px_0_0_hsl(var(--foreground))]"
                      sizes="40px"
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

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="h-4 w-4 text-primary" />
            Recommended for You
          </h2>
          {feed.suggestedDecks.length > 0 ? (
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
              {feed.suggestedDecks.map((deck) => (
                <Link key={deck.id} href={`/study/${deck.id}`}>
                  <NeoCard
                    size="sm"
                    className="min-w-40 shrink-0 cursor-pointer p-4 transition-transform hover:-translate-y-1"
                  >
                    <div
                      className={cn(
                        'mb-2 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                        deck.color
                      )}
                    >
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <p className="font-display text-sm font-bold">{deck.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {deck.cards} cards - {deck.category}
                    </p>
                    <span
                      className={cn(
                        inlineLinkClassName,
                        'mt-3 w-full bg-primary text-xs text-primary-foreground'
                      )}
                    >
                      Start
                    </span>
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

        <div className="pb-6">
          <Link href="/decks/editor/new">
            <NeoCard
              variant="teal"
              className="cursor-pointer p-5 text-center transition-transform hover:-translate-y-1"
            >
              <Sparkles className="mx-auto mb-2 h-6 w-6" />
              <p className="font-display font-bold">Create Your Own Deck</p>
              <p className="mt-1 text-xs text-foreground/70">
                Share your knowledge with the community
              </p>
            </NeoCard>
          </Link>
        </div>
      </main>
    </div>
  );
}
