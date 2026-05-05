import { NeoColor } from '@/lib/theme/neo-colors';

export type SagaProgress = {
  lastStudiedLessonId?: string | null;
  highestCompletedLessonId?: string | null;
  currentLessonId?: string | null;
  completedLessonCount: number;
  totalLessonCount: number;
  percentageComplete: number;
  startedAtUtc?: string | null;
  lastStudiedAtUtc?: string | null;
  completedAtUtc?: string | null;
};

export type SagaLesson = {
  id: string;
  deckId: string;
  deckTitle: string;
  title?: string | null;
  description?: string | null;
  order: number;
  cardCount: number;
};

export type SagaChapter = {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  lessons: SagaLesson[];
};

export type Saga = {
  id: string;
  title: string;
  category?: string | null;
  description?: string | null;
  visibility: number;
  color?: string | null;
  chapters: SagaChapter[];
  ownerUsername?: string | null;
  ownerName?: string | null;
  isOwner?: boolean;
  progress: SagaProgress;
};

export type SagaDisplayMeta = {
  emoji: string;
  tagline: string;
  color: NeoColor;
};

export type CreateSagaLessonInput = {
  deckId: string;
  title?: string | null;
  description?: string | null;
  order: number;
};

export type CreateSagaChapterInput = {
  title: string;
  description?: string | null;
  order: number;
  lessons: CreateSagaLessonInput[];
};

export type CreateSagaInput = {
  title: string;
  tagline?: string;
  description?: string | null;
  emoji: string;
  color: NeoColor;
  visibility: number;
  chapters: CreateSagaChapterInput[];
};

export type CreateSagaResult = {
  sagaId: string;
};

