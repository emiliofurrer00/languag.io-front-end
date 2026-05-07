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

export type AiSagaGenerationStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

export type AiSagaGenerationJob = {
  id: string;
  status: AiSagaGenerationStatus;
  createdSagaId?: string | null;
  errorMessage?: string | null;
  audioStatus?: 'NotRequested' | 'Pending' | 'Processing' | 'Ready' | 'Failed';
  requestedDeckCount: number;
  requestedCardsPerDeck: number;
  requestedMultiChoiceCountPerDeck: number;
  usageWeekStartUtc: string;
  nextAllowedAtUtc: string;
  createdAtUtc: string;
  startedAtUtc?: string | null;
  completedAtUtc?: string | null;
};

export type CreateAiSagaGenerationInput = {
  prompt: string;
  targetLanguage?: string;
  nativeLanguage?: string;
  difficulty: string;
  deckCount: number;
  cardsPerDeck: number;
  multiChoiceCountPerDeck: number;
  includeAudio: boolean;
};

export type CreateAiSagaGenerationResult = {
  jobId: string;
  nextAllowedAtUtc?: string | null;
};
