import Link from 'next/link';
import { ChevronRight, Compass, Flame, Layers, Plus, Trophy, Users } from 'lucide-react';
import SagasNavbar from './SagasNavbar';
import { NeoCard } from '@/components/ui/NeoCard';
import {
  getSagaDisplayMeta,
  getSagaLessonCount,
  getSagaTotalXp,
  normalizeSagaColor,
} from '@/lib/sagas/display';
import { Saga } from '@/lib/sagas/types';

type SagaListContainerProps = {
  sagas: Saga[];
};

function formatLearnerCount(seed: string) {
  const checksum = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0);
  return `${((checksum % 18) + 2).toFixed(1)}k`;
}

export default function SagaListContainer({ sagas }: SagaListContainerProps) {
  return (
    <div className="min-h-screen bg-background pt-28">
      <SagasNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20">
        <section className="pb-8 pt-3">
          <div className="max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border-[2px] border-foreground bg-neo-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              <Compass className="h-3.5 w-3.5" />
              New path builder
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              Pick your{' '}
              <span className="inline-block -rotate-1 rounded-md border-[2px] border-foreground bg-neo-coral px-2">
                adventure
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Sagas turn your decks into ordered learning journeys with chapters, progress, and a
              clear next lesson.
            </p>
          </div>
        </section>

        {sagas.length > 0 ? (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sagas.map((saga) => {
              const meta = getSagaDisplayMeta(saga);
              const lessonCount = getSagaLessonCount(saga);
              const totalXp = getSagaTotalXp(saga);

              return (
                <Link key={saga.id} href={`/sagas/${saga.id}`} className="group block">
                  <NeoCard
                    variant={normalizeSagaColor(saga.color)}
                    size="lg"
                    className="flex h-full flex-col transition-transform group-hover:-translate-y-0.5 group-hover:-translate-x-0.5"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-foreground bg-background text-3xl shadow-[4px_4px_0_0_hsl(var(--foreground))]">
                        {meta.emoji}
                      </div>
                      <span className="rounded-full border-[2px] border-foreground bg-background px-3 py-1 text-xs font-bold uppercase tracking-wide">
                        {lessonCount} {lessonCount === 1 ? 'deck' : 'decks'}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-bold leading-tight">
                      {saga.title || 'Untitled Saga'}
                    </h2>
                    <p className="mt-1 text-sm font-semibold opacity-80">{meta.tagline}</p>
                    <p className="mt-4 line-clamp-3 flex-1 text-sm opacity-90">
                      {saga.description || 'A creator-made path through related decks.'}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-3 border-t-[2px] border-foreground/20 pt-4">
                      <div className="flex min-w-0 flex-wrap items-center gap-3 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5" />
                          {totalXp.toLocaleString()} XP
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {formatLearnerCount(saga.id)}
                        </span>
                        {saga.progress.completedLessonCount > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Flame className="h-3.5 w-3.5" />
                            {Math.round(saga.progress.percentageComplete)}%
                          </span>
                        ) : null}
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </NeoCard>
                </Link>
              );
            })}
          </section>
        ) : (
          <NeoCard className="mx-auto max-w-xl p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-[2px] border-foreground bg-primary shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <Layers className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">No sagas yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Build a path from your decks and split it into chapters with checkpoints.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/sagas/create"
                className="inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-primary px-4 py-2 font-display font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Create Saga
              </Link>
            </div>
          </NeoCard>
        )}
      </main>
    </div>
  );
}

