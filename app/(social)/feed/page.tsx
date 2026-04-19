import { NeoCard } from '@/components/ui/NeoCard';
import { NeoButton } from '@/components/ui/NeoButton';
import { Progress } from '@/components/ui/Progress';
import FollowButton from '@/components/ui/FollowButton';
import Navbar from '@/components/landing/Navbar';
import {
  Flame,
  Trophy,
  Layers,
  BookOpen,
  Zap,
  Heart,
  ChevronRight,
  Crown,
  Target,
  Calendar,
  User,
  Sparkles,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
    icon: Trophy,
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
    icon: Sparkles,
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
    icon: Flame,
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
    icon: Zap,
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

const Feed = () => {
  const dailyGoal = 20;
  const dailyProgress = 14;
  const xp = 1420;
  const streak = 4;
  const league = 'Gold';

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Daily Goal Card */}
        <NeoCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl border-2 border-foreground bg-primary flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-sm">Daily Goal</p>
                <p className="text-xs text-muted-foreground">
                  {dailyProgress}/{dailyGoal} cards today
                </p>
              </div>
            </div>
            <span className="font-display font-bold text-2xl text-primary">
              {Math.round((dailyProgress / dailyGoal) * 100)}%
            </span>
          </div>
          <div className="relative">
            <Progress
              value={(dailyProgress / dailyGoal) * 100}
              className="h-4 border-2 border-foreground rounded-full bg-secondary"
            />
          </div>
        </NeoCard>

        {/* Streak Tracker */}
        <NeoCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-neo-coral" />
              <span className="font-display font-bold">{streak} day streak!</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Keep it up 🔥</span>
          </div>
          <div className="flex justify-between">
            {STREAK_DAYS.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all',
                    d.done
                      ? 'border-foreground bg-neo-teal shadow-[2px_2px_0_0_hsl(var(--foreground))]'
                      : 'border-foreground/30 bg-secondary'
                  )}
                >
                  {d.done ? (
                    <Zap className="w-4 h-4" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold',
                    d.done ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </NeoCard>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <NeoCard size="sm" className="p-3 text-center">
            <div className="w-8 h-8 rounded-lg border-2 border-foreground bg-neo-yellow flex items-center justify-center mx-auto mb-1 shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <Crown className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-sm">{league}</p>
            <p className="text-[10px] text-muted-foreground">League</p>
          </NeoCard>
          <NeoCard size="sm" className="p-3 text-center">
            <div className="w-8 h-8 rounded-lg border-2 border-foreground bg-neo-magenta flex items-center justify-center mx-auto mb-1 shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <Layers className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-sm">12</p>
            <p className="text-[10px] text-muted-foreground">Decks</p>
          </NeoCard>
          <NeoCard size="sm" className="p-3 text-center">
            <div className="w-8 h-8 rounded-lg border-2 border-foreground bg-neo-teal flex items-center justify-center mx-auto mb-1 shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-sm">847</p>
            <p className="text-[10px] text-muted-foreground">Cards</p>
          </NeoCard>
        </div>

        {/* Continue Studying */}
        {CONTINUE_DECKS.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-lg">Continue Studying</h2>
              <Link
                href="/decks"
                className="text-xs text-muted-foreground font-semibold hover:text-foreground transition-colors"
              >
                See all →
              </Link>
            </div>
            <div className="space-y-3">
              {CONTINUE_DECKS.map((deck) => (
                <Link key={deck.id} href={`/study/${deck.id}`}>
                  <NeoCard
                    size="sm"
                    className="p-4 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl border-2 border-foreground flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))] shrink-0',
                          deck.color
                        )}
                      >
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm truncate">{deck.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {deck.cards} cards · {deck.lastStudied}
                        </p>
                        <div className="mt-1.5">
                          <Progress
                            value={deck.progress}
                            className="h-2 border border-foreground/30 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-display font-bold text-sm text-primary">
                          {deck.progress}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground mx-auto mt-0.5" />
                      </div>
                    </div>
                  </NeoCard>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Activity Feed */}
        <section>
          <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-neo-coral" />
            Friends Activity
          </h2>
          <NeoCard className="divide-y-2 divide-foreground/10">
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className="p-4 flex items-start gap-3">
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl border-2 border-foreground flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                    item.color
                  )}
                >
                  <span className="font-display font-bold text-[10px]">{item.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-bold">{item.user}</span>{' '}
                    <span className="text-muted-foreground">{item.action}</span>{' '}
                    <span className="font-semibold">{item.target}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    {item.followsYou && !item.isFollowing && (
                      <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border border-foreground/30 bg-secondary">
                        Follows you
                      </span>
                    )}
                  </div>
                </div>
                <FollowButton followsYou={item.followsYou} initialFollowing={item.isFollowing} />
              </div>
            ))}
          </NeoCard>
        </section>

        {/* Suggested People */}
        <section>
          <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            People to Follow
          </h2>
          <NeoCard className="divide-y-2 divide-foreground/10">
            {[
              {
                name: 'Lena P.',
                handle: 'lenap',
                avatar: 'LP',
                color: 'bg-neo-yellow',
                bio: 'Polyglot · 8 languages',
              },
              {
                name: 'Diego F.',
                handle: 'diegof',
                avatar: 'DF',
                color: 'bg-neo-coral',
                bio: 'CS student · loves algorithms',
              },
              {
                name: 'Yuki T.',
                handle: 'yukit',
                avatar: 'YT',
                color: 'bg-neo-blue',
                bio: 'Med school flashcard fanatic',
              },
            ].map((p) => (
              <div key={p.handle} className="p-4 flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl border-2 border-foreground flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                    p.color
                  )}
                >
                  <span className="font-display font-bold text-xs">{p.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    @{p.handle} · {p.bio}
                  </p>
                </div>
                <FollowButton />
              </div>
            ))}
          </NeoCard>
        </section>

        {/* Suggested Decks */}
        <section>
          <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Recommended for You
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {SUGGESTED_DECKS.map((deck, i) => (
              <NeoCard
                key={i}
                size="sm"
                className="p-4 min-w-40 shrink-0 cursor-pointer hover:-translate-y-1 transition-transform"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl border-2 border-foreground flex items-center justify-center mb-2 shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                    deck.color
                  )}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="font-display font-bold text-sm">{deck.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {deck.cards} cards · {deck.category}
                </p>
                <NeoButton variant="primary" size="sm" className="w-full mt-3 text-xs">
                  Start
                </NeoButton>
              </NeoCard>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pb-6">
          <Link href="/create-deck">
            <NeoCard
              variant="teal"
              className="p-5 text-center cursor-pointer hover:-translate-y-1 transition-transform"
            >
              <Sparkles className="w-6 h-6 mx-auto mb-2" />
              <p className="font-display font-bold">Create Your Own Deck</p>
              <p className="text-xs text-foreground/70 mt-1">
                Share your knowledge with the community
              </p>
            </NeoCard>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Feed;
