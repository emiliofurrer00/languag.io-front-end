'use client';

import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  Compass,
  Flame,
  Layers,
  Plus,
  RefreshCcw,
  Route,
  Trophy,
  Users,
  WifiOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import SagasNavbar from './SagasNavbar';
import { AppStatePanel, stateActionClassName } from '@/components/ui/AppStatePanel';
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
  serviceError?: string | null;
};

const primaryActionClassName =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-primary px-4 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const secondaryActionClassName =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-secondary px-4 font-display text-sm font-semibold text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function formatLearnerCount(seed: string) {
  const checksum = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0);
  return `${((checksum % 18) + 2).toFixed(1)}k`;
}

export default function SagaListContainer({ sagas, serviceError }: SagaListContainerProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pt-28">
      <SagasNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20">
        <section className="pb-8 pt-3">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border-[2px] border-foreground bg-neo-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                <Compass className="h-3.5 w-3.5" />
                Ordered paths
              </span>
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">Sagas</h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Turn decks into guided learning paths with chapters, checkpoints, and one clear next
                lesson.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/sagas/create" className={primaryActionClassName}>
                  <Plus className="h-4 w-4" />
                  Create saga
                </Link>
                <Link href="/decks" className={secondaryActionClassName}>
                  <BookOpen className="h-4 w-4" />
                  Browse decks
                </Link>
              </div>
            </div>
            <span className="inline-flex h-12 w-fit items-center gap-2 rounded-xl border-[2px] border-foreground bg-secondary px-4 text-sm font-semibold shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <Layers className="h-4 w-4" />
              {sagas.length} {sagas.length === 1 ? 'saga' : 'sagas'}
            </span>
          </div>
        </section>

        {serviceError ? (
          <AppStatePanel
            icon={WifiOff}
            tone="error"
            kicker="Backend offline"
            title="Sagas could not load"
            description={serviceError}
            className="mx-auto max-w-2xl"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => router.refresh()}
                className={stateActionClassName}
              >
                <RefreshCcw className="h-4 w-4" />
                Try again
              </button>
              <Link href="/decks" className={stateActionClassName}>
                <BookOpen className="h-4 w-4" />
                Browse decks
              </Link>
            </div>
          </AppStatePanel>
        ) : sagas.length > 0 ? (
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
          <AppStatePanel
            icon={Route}
            kicker="First path"
            title="No sagas yet"
            description="Turn a handful of related decks into a chaptered path once you are ready for more structure."
            className="mx-auto max-w-2xl"
          >
            <ul className="mx-auto mb-6 grid max-w-md gap-2 text-left text-sm font-medium">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-neo-yellow font-display text-xs font-bold">
                  1
                </span>
                Pick two or more decks that belong together.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-neo-teal font-display text-xs font-bold">
                  2
                </span>
                Order them from warm-up to challenge.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-neo-magenta font-display text-xs font-bold">
                  3
                </span>
                Use checkpoints to make the next lesson obvious.
              </li>
            </ul>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/sagas/create"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Create saga
              </Link>
              <Link href="/decks" className={stateActionClassName}>
                <BookOpen className="h-4 w-4" />
                Browse decks
              </Link>
            </div>
          </AppStatePanel>
        )}
      </main>
    </div>
  );
}
