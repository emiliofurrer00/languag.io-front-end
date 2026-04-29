import { DeckStudyRecommendation } from '@/lib/decks/types';
import { getNeoColorClass } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';
import { BookOpen, Clock, Layers, RotateCcw, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';

type StudyRecommendationsProps = {
  recommendations: DeckStudyRecommendation[];
};

function formatNextDue(value?: string | null) {
  if (!value) {
    return 'No reviews yet';
  }

  const dueAt = new Date(value);
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

export default function StudyRecommendations({ recommendations }: StudyRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Recommended Next</h2>
          <p className="mt-1 text-sm text-muted-foreground">Cards due, new, or worth revisiting.</p>
        </div>
        <span className="hidden rounded-full border-[2px] border-foreground bg-neo-yellow px-3 py-1 text-xs font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))] sm:inline-flex">
          SRS
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {recommendations.slice(0, 3).map((recommendation) => (
          <Link
            key={recommendation.deckId}
            href={`/study/${recommendation.deckId}`}
            className={cn(
              'group rounded-xl border-[3px] border-foreground p-4 shadow-[5px_5px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
              getNeoColorClass(recommendation.color)
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex max-w-full items-center gap-1 rounded-full border-[2px] border-foreground bg-background/80 px-2.5 py-1 text-xs font-semibold">
                  <Target className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{formatNextDue(recommendation.nextDueAtUtc)}</span>
                </span>
                <h3 className="mt-3 line-clamp-2 font-display text-lg font-bold">
                  {recommendation.title || 'Untitled Deck'}
                </h3>
              </div>
              <BookOpen className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 rounded-lg border-[2px] border-foreground bg-background/70 px-2 py-1">
                <Clock className="h-3.5 w-3.5" />
                {recommendation.dueCards} due
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border-[2px] border-foreground bg-background/70 px-2 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                {recommendation.newCards} new
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border-[2px] border-foreground bg-background/70 px-2 py-1">
                <RotateCcw className="h-3.5 w-3.5" />
                {recommendation.lapsedCards} lapsed
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border-[2px] border-foreground bg-background/70 px-2 py-1">
                <Layers className="h-3.5 w-3.5" />
                {recommendation.totalCards} cards
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
