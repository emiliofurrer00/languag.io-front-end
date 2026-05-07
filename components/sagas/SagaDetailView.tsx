import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Crown,
  Flame,
  LayoutGrid,
  Lock,
  Play,
  Star,
  Trophy,
} from 'lucide-react';
import { NeoButton } from '@/components/ui/NeoButton';
import {
  getLessonTitle,
  getLessonXp,
  getSagaDisplayMeta,
  getSagaEarnedXp,
  getSagaLessonCount,
  normalizeSagaColor,
} from '@/lib/sagas/display';
import { DesktopSideNav } from '@/components/layout/DesktopSideNav';
import { Saga, SagaLesson } from '@/lib/sagas/types';
import { cn } from '@/lib/utils';

const POSITIONS = [0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1];
const CHAPTER_COLORS = ['coral', 'yellow', 'teal', 'blue', 'magenta'] as const;

type LessonStatus = 'completed' | 'current' | 'locked';

type SagaLessonNode = {
  lesson: SagaLesson;
  status: LessonStatus;
  index: number;
  isFinalLesson: boolean;
};

function buildStudyHref(sagaId: string, lesson: SagaLesson) {
  const params = new URLSearchParams({
    sagaId,
    lessonId: lesson.id,
  });

  return `/study/${lesson.deckId}?${params.toString()}`;
}

function getLessonNodes(saga: Saga) {
  const lessons = saga.chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({ lesson, chapterId: chapter.id }))
  );
  const completedCount = Math.min(saga.progress.completedLessonCount, lessons.length);
  const currentLessonId = saga.progress.currentLessonId;

  return lessons.map(({ lesson }, index): SagaLessonNode => {
    const status: LessonStatus =
      index < completedCount
        ? 'completed'
        : currentLessonId === lesson.id || (!currentLessonId && index === completedCount)
          ? 'current'
          : 'locked';

    return {
      lesson,
      status,
      index,
      isFinalLesson: index === lessons.length - 1,
    };
  });
}

function NodeBubble({ sagaId, node }: { sagaId: string; node: SagaLessonNode }) {
  const offset = POSITIONS[node.index % POSITIONS.length];
  const isLocked = node.status === 'locked';
  const isCurrent = node.status === 'current';
  const isDone = node.status === 'completed';
  const isFinalLesson = node.isFinalLesson;
  const size = isFinalLesson ? 'h-28 w-28' : 'h-20 w-20';
  const Icon = isLocked ? Lock : isDone ? Check : isFinalLesson ? Crown : Play;
  const stateClasses = isLocked
    ? 'border-foreground/40 bg-muted text-muted-foreground shadow-[4px_4px_0_0_hsl(var(--foreground)/0.3)]'
    : isCurrent
      ? 'border-foreground bg-primary text-primary-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))] motion-safe:animate-bounce-slow'
      : 'border-foreground bg-neo-teal text-foreground shadow-[5px_5px_0_0_hsl(var(--foreground))]';

  const inner = (
    <div
      style={{ transform: `translateX(${offset * 32}px)` }}
      className="group relative flex flex-col items-center"
    >
      {isDone ? (
        <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 gap-0.5">
          {[1, 2, 3].map((star) => (
            <Star key={star} className="h-4 w-4 fill-neo-yellow stroke-foreground stroke-[2]" />
          ))}
        </div>
      ) : null}

      {isCurrent ? (
        <span className="pointer-events-none absolute inset-0 -m-2 rounded-full border-[3px] border-foreground/20 motion-safe:animate-ping" />
      ) : null}

      <div
        className={cn(
          'relative flex items-center justify-center rounded-full border-[3px] transition-transform',
          size,
          stateClasses,
          isFinalLesson && !isLocked ? 'bg-neo-magenta' : null,
          !isLocked &&
            'motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:-translate-x-[2px]'
        )}
      >
        <Icon className={cn(isFinalLesson ? 'h-9 w-9' : 'h-7 w-7', 'stroke-[2.5]')} />
        {isCurrent ? (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border-[2px] border-foreground bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
            Start
          </span>
        ) : null}
      </div>

      <div className="mt-3 max-w-[180px] text-center">
        <p
          className={cn(
            'font-display text-sm font-bold leading-tight',
            isLocked && 'text-muted-foreground'
          )}
        >
          {getLessonTitle(node.lesson)}
        </p>
        {!isLocked ? (
          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
            {node.lesson.cardCount} cards - {getLessonXp(node.lesson)} XP
          </p>
        ) : null}
      </div>
    </div>
  );

  if (isLocked) {
    return <div aria-disabled="true">{inner}</div>;
  }

  return (
    <Link
      href={buildStudyHref(sagaId, node.lesson)}
      aria-label={`${getLessonTitle(node.lesson)} - ${node.status}`}
      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
    >
      {inner}
    </Link>
  );
}

export default function SagaDetailView({ saga }: { saga: Saga }) {
  const meta = getSagaDisplayMeta(saga);
  const color = normalizeSagaColor(saga.color);
  const nodes = getLessonNodes(saga);
  const completed = Math.min(saga.progress.completedLessonCount, nodes.length);
  const total = getSagaLessonCount(saga);
  const progressPct = total ? Math.round((completed / total) * 100) : 0;
  const earnedXp = getSagaEarnedXp(saga);
  const currentNode = nodes.find((node) => node.status === 'current');

  return (
    <>
      <DesktopSideNav />
      <div className="min-h-screen bg-background pb-32">
        <header className="sticky top-0 z-40 border-b-[3px] border-foreground bg-background/90 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-7xl px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="/sagas">
                  <NeoButton variant="outline" size="sm" aria-label="Back to sagas">
                    <ArrowLeft className="h-4 w-4" />
                  </NeoButton>
                </Link>
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[2px] border-foreground text-xl shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                    `bg-neo-${color}`
                  )}
                >
                  {meta.emoji}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate font-display text-lg font-bold leading-tight">
                    {saga.title}
                  </h1>
                  <p className="truncate text-xs text-muted-foreground">{meta.tagline}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link href="/decks" className="hidden sm:block">
                  <NeoButton variant="outline" size="sm">
                    <LayoutGrid className="h-4 w-4" />
                    Decks
                  </NeoButton>
                </Link>
                <span className="hidden items-center gap-1 rounded-full border-[2px] border-foreground bg-neo-yellow px-3 py-1.5 text-xs font-bold md:flex">
                  <Trophy className="h-3.5 w-3.5" />
                  {earnedXp} XP
                </span>
                <span className="hidden items-center gap-1 rounded-full border-[2px] border-foreground bg-neo-coral px-3 py-1.5 text-xs font-bold md:flex">
                  <Flame className="h-3.5 w-3.5" />
                  {completed}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full border-[2px] border-foreground bg-muted">
                <div
                  className="h-full bg-neo-teal transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className="shrink-0 text-xs font-bold tabular-nums">
                {completed}/{total} - {progressPct}%
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 pt-12">
          {saga.chapters.length === 0 ? (
            <div className="py-20 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">This saga is being written. Check back soon.</p>
            </div>
          ) : null}

          {saga.chapters.map((chapter, chapterIndex) => {
            const priorLessons = saga.chapters
              .slice(0, chapterIndex)
              .reduce((sum, currentChapter) => sum + currentChapter.lessons.length, 0);
            const chapterColor = CHAPTER_COLORS[chapterIndex % CHAPTER_COLORS.length];

            return (
              <section key={chapter.id} className="mb-16">
                <div className="relative mb-10">
                  <div
                    className={cn(
                      'flex items-center gap-4 rounded-2xl border-[3px] border-foreground p-5 shadow-[6px_6px_0_0_hsl(var(--foreground))]',
                      `bg-neo-${chapterColor}`
                    )}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-background font-display text-lg font-bold">
                      {chapterIndex + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                        Chapter {chapterIndex + 1}
                      </p>
                      <h2 className="font-display text-xl font-bold leading-tight">
                        {chapter.title}
                      </h2>
                      {chapter.description ? (
                        <p className="text-sm opacity-80">{chapter.description}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col items-center gap-12">
                  <div
                    className="pointer-events-none absolute bottom-4 left-1/2 top-4 w-0 -translate-x-1/2 border-l-[3px] border-dashed border-foreground/25"
                    aria-hidden="true"
                  />
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const node = nodes[priorLessons + lessonIndex];
                    return node ? (
                      <NodeBubble key={lesson.id} sagaId={saga.id} node={node} />
                    ) : null;
                  })}
                </div>
              </section>
            );
          })}

          {saga.chapters.length > 0 ? (
            <div className="mt-8 flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-dashed border-foreground/40">
                <Trophy className="h-8 w-8 text-foreground/40" />
              </div>
              <p className="mt-3 font-display text-sm font-bold text-muted-foreground">
                The end of the saga
              </p>
            </div>
          ) : null}
        </main>

        {currentNode ? (
          <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 px-4 lg:left-[calc(50%+7.5rem)]">
            <Link href={buildStudyHref(saga.id, currentNode.lesson)}>
              <NeoButton
                variant="primary"
                size="lg"
                className="whitespace-nowrap shadow-[6px_6px_0_0_hsl(var(--foreground))]"
              >
                <Play className="h-5 w-5 fill-foreground" />
                Continue: {getLessonTitle(currentNode.lesson)}
              </NeoButton>
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
