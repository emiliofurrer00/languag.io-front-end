import { DeckStudyRecommendation } from '@/lib/decks/types';
import { getNeoColorClass } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  Clock,
  Flame,
  Layers,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import Link from 'next/link';

type StudyRecommendationsProps = {
  recommendations: DeckStudyRecommendation[];
};

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatNextDue(value?: string | null) {
  if (!value) {
    return 'No reviews yet';
  }

  const dueAt = new Date(value);
  if (Number.isNaN(dueAt.getTime())) {
    return 'No reviews yet';
  }

  const now = new Date();
  const diffMs = dueAt.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'Due now';
  }

  if (diffDays === 1) {
    return 'Due tomorrow';
  }

  return `Due in ${diffDays} days`;
}

function formatAccuracy(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'No accuracy yet';
  }

  const percent = value <= 1 ? value * 100 : value;

  return `${Math.round(percent)}% correct`;
}

function getFocusLabel(recommendation: DeckStudyRecommendation) {
  if (recommendation.overdueCards > 0) {
    return pluralize(recommendation.overdueCards, 'overdue card');
  }

  if (recommendation.dueCards > 0) {
    return pluralize(recommendation.dueCards, 'due card');
  }

  if (recommendation.lapsedCards > 0) {
    return pluralize(recommendation.lapsedCards, 'lapsed card');
  }

  if (recommendation.newCards > 0) {
    return pluralize(recommendation.newCards, 'new card');
  }

  return 'Ready for review';
}

export default function StudyRecommendations({ recommendations }: StudyRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  const displayedRecommendations = recommendations.slice(0, 3);
  const [primaryRecommendation, ...queuedRecommendations] = displayedRecommendations;
  const totalDueCards = recommendations.reduce((total, item) => total + item.dueCards, 0);
  const totalNewCards = recommendations.reduce((total, item) => total + item.newCards, 0);
  const totalLapsedCards = recommendations.reduce((total, item) => total + item.lapsedCards, 0);
  const totalReviewLoad = totalDueCards + totalNewCards + totalLapsedCards;

  return (
    <section aria-labelledby="study-next-title" className="mb-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-[2px] border-foreground bg-primary shadow-[3px_3px_0_0_hsl(var(--foreground))]">
            <BookOpenCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">Daily queue</p>
            <h2 id="study-next-title" className="font-display text-2xl font-bold">
              Study next
            </h2>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-lg border-[2px] border-foreground bg-background px-3 py-2 text-sm font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))]">
          <Flame className="h-4 w-4 text-neo-coral" />
          {totalReviewLoad > 0 ? pluralize(totalReviewLoad, 'card') : 'Queue clear'}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.85fr)]">
        <Link
          href={`/study/${primaryRecommendation.deckId}`}
          className={cn(
            'group relative isolate min-h-[16rem] overflow-hidden rounded-lg border-[3px] border-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
            getNeoColorClass(primaryRecommendation.color, 'yellow')
          )}
        >
          <div className="absolute inset-y-0 right-0 hidden w-1/3 border-l-[3px] border-foreground/70 bg-background/25 lg:block" />
          <div className="relative flex h-full flex-col justify-between gap-6 p-5 sm:p-6">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border-[2px] border-foreground bg-background/85 px-3 py-1.5 text-xs font-bold">
                  <Target className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {formatNextDue(primaryRecommendation.nextDueAtUtc)}
                  </span>
                </span>
                <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border-[2px] border-foreground bg-background/85 px-3 py-1.5 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{getFocusLabel(primaryRecommendation)}</span>
                </span>
              </div>

              <h3 className="max-w-2xl text-balance font-display text-3xl font-bold leading-tight">
                {primaryRecommendation.title || 'Untitled Deck'}
              </h3>
              {primaryRecommendation.description ? (
                <p className="mt-3 max-w-2xl line-clamp-2 text-sm font-medium">
                  {primaryRecommendation.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {primaryRecommendation.dueCards} due
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  {primaryRecommendation.newCards} new
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4" />
                  {primaryRecommendation.lapsedCards} lapsed
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  {pluralize(primaryRecommendation.totalCards, 'card')}
                </span>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-lg border-[2px] border-foreground bg-foreground px-4 py-2 font-display text-sm font-bold text-background shadow-[3px_3px_0_0_hsl(var(--background))] transition-transform group-hover:translate-x-1">
                Start
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        <div className="rounded-lg border-[3px] border-foreground bg-background p-4 shadow-[6px_6px_0_0_hsl(var(--foreground))]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold">Today</h3>
              <p className="text-sm text-muted-foreground">
                {formatAccuracy(primaryRecommendation.accuracy)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg border-[2px] border-foreground bg-neo-yellow px-2.5 py-1 text-xs font-bold">
              <CalendarClock className="h-3.5 w-3.5" />
              Top {displayedRecommendations.length}
            </span>
          </div>

          <dl className="grid grid-cols-3 border-y-[2px] border-foreground py-3 text-center">
            <div>
              <dt className="text-[11px] font-bold uppercase text-muted-foreground">Due</dt>
              <dd className="font-display text-2xl font-bold">{totalDueCards}</dd>
            </div>
            <div className="border-x-[2px] border-foreground">
              <dt className="text-[11px] font-bold uppercase text-muted-foreground">New</dt>
              <dd className="font-display text-2xl font-bold">{totalNewCards}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase text-muted-foreground">Lapsed</dt>
              <dd className="font-display text-2xl font-bold">{totalLapsedCards}</dd>
            </div>
          </dl>

          <div className="mt-4 space-y-3">
            {queuedRecommendations.length > 0 ? (
              queuedRecommendations.map((recommendation, index) => (
                <Link
                  key={recommendation.deckId}
                  href={`/study/${recommendation.deckId}`}
                  className="group flex items-center justify-between gap-3 rounded-lg border-[2px] border-foreground bg-secondary px-3 py-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-secondary/90 hover:shadow-[3px_3px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[2px] border-foreground font-display text-sm font-bold',
                      getNeoColorClass(recommendation.color, index === 0 ? 'teal' : 'magenta')
                    )}
                  >
                    {index + 2}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-bold">
                      {recommendation.title || 'Untitled Deck'}
                    </span>
                    <span className="block truncate text-xs font-semibold text-muted-foreground">
                      {formatNextDue(recommendation.nextDueAtUtc)} -{' '}
                      {pluralize(recommendation.totalCards, 'card')}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))
            ) : (
              <p className="rounded-lg border-[2px] border-dashed border-foreground px-3 py-4 text-sm font-semibold text-muted-foreground">
                This is the next best deck in your queue.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
