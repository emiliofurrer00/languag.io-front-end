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

export type StudyPlanReason = 'Due' | 'Lapsed' | 'New' | 'Review';

export type StudyPlanCard = {
  cardId: string;
  deckId: string;
  type?: CardType;
  frontText: string;
  backText: string;
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

export const emptyDeckDetails: DeckDetails = {
  title: '',
  description: '',
  category: '',
  color: 'teal',
  visibility: 1,
  cards: [],
};
