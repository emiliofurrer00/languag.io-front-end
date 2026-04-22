import Link from 'next/link';
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

import Navbar from '@/components/landing/Navbar';
import FollowButton from '@/components/ui/FollowButton';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

const STREAK_DAYS = [
  { day: 'Mon', done: true },
  { day: 'Tue', done: true },
  { day: 'Wed', done: true },
  { day: 'Thu', done: true },
  { day: 'Fri', done: false },
  { day: 'Sat', done: false },
  { day: 'Sun', done: false },
];

const ACTIVITY_FEED = [
  {
    user: 'Sara M.',
    avatar: 'SM',
    color: 'bg-neo-magenta',
    action: 'mastered',
    target: 'Spanish Basics',
    time: '2h ago',
    followsYou: true,
    isFollowing: true,
  },
  {
    user: 'Jake R.',
    avatar: 'JR',
    color: 'bg-neo-teal',
    action: 'created',
    target: 'React Hooks 101',
    time: '4h ago',
    followsYou: true,
    isFollowing: false,
  },
  {
    user: 'Mia L.',
    avatar: 'ML',
    color: 'bg-neo-blue',
    action: 'completed a 30-day streak in',
    target: 'French Vocabulary',
    time: '6h ago',
    followsYou: false,
    isFollowing: true,
  },
  {
    user: 'Alex K.',
    avatar: 'AK',
    color: 'bg-neo-coral',
    action: 'studied 50 cards in',
    target: 'Biology Terms',
    time: '1d ago',
    followsYou: false,
    isFollowing: false,
  },
];

const SUGGESTED_DECKS = [
  { title: 'Spanish Basics', cards: 30, category: 'Language', color: 'bg-neo-coral', progress: 0 },
  {
    title: 'JavaScript ES6+',
    cards: 45,
    category: 'Programming',
    color: 'bg-neo-teal',
    progress: 0,
  },
  { title: 'World Capitals', cards: 60, category: 'Geography', color: 'bg-neo-blue', progress: 0 },
];

const CONTINUE_DECKS = [
  {
    id: '1',
    title: 'React Fundamentals',
    cards: 25,
    progress: 68,
    color: 'bg-neo-yellow',
    lastStudied: 'Today',
  },
  {
    id: '2',
    title: 'Spanish Verbs',
    cards: 40,
    progress: 35,
    color: 'bg-neo-magenta',
    lastStudied: 'Yesterday',
  },
];

const SUGGESTED_PEOPLE = [
  {
    name: 'Lena P.',
    handle: 'lenap',
    avatar: 'LP',
    color: 'bg-neo-yellow',
    bio: 'Polyglot - 8 languages',
  },
  {
    name: 'Diego F.',
    handle: 'diegof',
    avatar: 'DF',
    color: 'bg-neo-coral',
    bio: 'CS student - loves algorithms',
  },
  {
    name: 'Yuki T.',
    handle: 'yukit',
    avatar: 'YT',
    color: 'bg-neo-blue',
    bio: 'Med school flashcard fanatic',
  },
];

export default function Feed() {
  const dailyGoal = 20;
  const dailyProgress = 14;
  const dailyGoalPercentage = (dailyProgress / dailyGoal) * 100;
  const streak = 4;
  const league = 'Gold';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
            {STREAK_DAYS.map((day) => (
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
            <p className="font-display text-sm font-bold">{league}</p>
            <p className="text-[10px] text-muted-foreground">League</p>
          </NeoCard>
          <NeoCard size="sm" className="p-3 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-foreground bg-neo-magenta shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <Layers className="h-4 w-4" />
            </div>
            <p className="font-display text-sm font-bold">12</p>
            <p className="text-[10px] text-muted-foreground">Decks</p>
          </NeoCard>
          <NeoCard size="sm" className="p-3 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-foreground bg-neo-teal shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="font-display text-sm font-bold">847</p>
            <p className="text-[10px] text-muted-foreground">Cards</p>
          </NeoCard>
        </div>

        {CONTINUE_DECKS.length > 0 ? (
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
              {CONTINUE_DECKS.map((deck) => (
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
          <NeoCard className="divide-y-2 divide-foreground/10">
            {ACTIVITY_FEED.map((item) => (
              <div key={`${item.user}-${item.target}`} className="flex items-start gap-3 p-4">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                    item.color
                  )}
                >
                  <span className="font-display text-[10px] font-bold">{item.avatar}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-bold">{item.user}</span>{' '}
                    <span className="text-muted-foreground">{item.action}</span>{' '}
                    <span className="font-semibold">{item.target}</span>
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    {item.followsYou && !item.isFollowing ? (
                      <span className="rounded-full border border-foreground/30 bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                        Follows you
                      </span>
                    ) : null}
                  </div>
                </div>
                <FollowButton followsYou={item.followsYou} initialFollowing={item.isFollowing} />
              </div>
            ))}
          </NeoCard>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <UserPlus className="h-4 w-4 text-primary" />
            People to Follow
          </h2>
          <NeoCard className="divide-y-2 divide-foreground/10">
            {SUGGESTED_PEOPLE.map((person) => (
              <div key={person.handle} className="flex items-center gap-3 p-4">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                    person.color
                  )}
                >
                  <span className="font-display text-xs font-bold">{person.avatar}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{person.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    @{person.handle} - {person.bio}
                  </p>
                </div>
                <FollowButton />
              </div>
            ))}
          </NeoCard>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="h-4 w-4 text-primary" />
            Recommended for You
          </h2>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {SUGGESTED_DECKS.map((deck) => (
              <NeoCard
                key={deck.title}
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
                <NeoButton variant="primary" size="sm" className="mt-3 w-full text-xs">
                  Start
                </NeoButton>
              </NeoCard>
            ))}
          </div>
        </section>

        <div className="pb-6">
          <Link href="/create-deck">
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
