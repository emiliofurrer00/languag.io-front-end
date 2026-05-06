export type CardType = 'flashcard' | 'multi-choice';

export type CardChoice = {
  id?: string;
  text: string;
  isCorrect: boolean;
  order: number;
};

export type DeckCard = {
  id?: string;
  type?: CardType;
  frontText: string;
  backText: string;
  frontAudioAssetId?: string | null;
  frontAudioUrl?: string | null;
  frontAudioStatus?: 'Pending' | 'Processing' | 'Ready' | 'Failed' | null;
  order?: number;
  exampleSentence?: string | null;
  choices?: CardChoice[];
  isNew?: boolean;
  isDue?: boolean;
  dueAtUtc?: string | null;
  intervalDays?: number;
  accuracy?: number;
  totalReviews?: number;
  reason?: StudyPlanReason;
};

export type DeckDetails = {
  title: string;
  description: string;
  category: string;
  color: string;
  visibility: number;
  id?: string;
  cards: DeckCard[];
  ownerName?: string;
  ownerUsername?: string | null;
  isOwner?: boolean;
  canEdit?: boolean;
};

export type DeckSummary = DeckDetails & {
  id: string;
};

export type CursorPage<T> = {
  items: T[];
  nextCursor?: string | null;
};

export function normalizeCursorPage<T>(value: unknown): CursorPage<T> {
  if (Array.isArray(value)) {
    return { items: value as T[], nextCursor: null };
  }

  if (!value || typeof value !== 'object') {
    return { items: [], nextCursor: null };
  }

  const record = value as Record<string, unknown>;
  const rawItems = Array.isArray(record.items) ? record.items : [];

  return {
    items: rawItems as T[],
    nextCursor: typeof record.nextCursor === 'string' ? record.nextCursor : null,
  };
}

export type StudyPlanReason = 'Due' | 'Lapsed' | 'New' | 'Review';

export type StudyPlanCard = {
  cardId: string;
  deckId: string;
  type?: CardType;
  frontText: string;
  backText: string;
  frontAudioAssetId?: string | null;
  frontAudioUrl?: string | null;
  frontAudioStatus?: 'Pending' | 'Processing' | 'Ready' | 'Failed' | null;
  exampleSentence?: string | null;
  choices?: CardChoice[];
  order: number;
  isNew: boolean;
  isDue: boolean;
  lastReviewedAtUtc?: string | null;
  dueAtUtc?: string | null;
  intervalDays: number;
  easeFactor: number;
  repetitionCount: number;
  lapseCount: number;
  totalReviews: number;
  correctReviews: number;
  accuracy: number;
  reason: StudyPlanReason;
};

export type DeckStudyRecommendation = {
  deckId: string;
  title: string;
  category: string;
  description?: string | null;
  color?: string | null;
  totalCards: number;
  dueCards: number;
  newCards: number;
  lapsedCards: number;
  overdueCards: number;
  nextDueAtUtc?: string | null;
  accuracy?: number | null;
  priorityScore: number;
};

export type AiDeckGenerationStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

export type AiDeckGenerationJob = {
  id: string;
  status: AiDeckGenerationStatus;
  createdDeckId?: string | null;
  errorMessage?: string | null;
  audioStatus?: 'NotRequested' | 'Pending' | 'Processing' | 'Ready' | 'Failed';
  requestedCardCount: number;
  requestedMultiChoiceCount: number;
  createdAtUtc: string;
  startedAtUtc?: string | null;
  completedAtUtc?: string | null;
};

export const emptyDeckDetails: DeckDetails = {
  title: '',
  description: '',
  category: '',
  color: 'teal',
  visibility: 1,
  cards: [],
};
