import { CardType, DeckCard, DeckDetails, StudyPlanReason } from '@/lib/decks/types';

export type StudyFlashCard = DeckCard & {
  id: string;
  type?: 'flashcard';
  isNew?: boolean;
  isDue?: boolean;
  dueAtUtc?: string | null;
  intervalDays?: number;
  accuracy?: number;
  totalReviews?: number;
  reason?: StudyPlanReason;
};

export type StudyCard = DeckCard & {
  id: string;
  type: CardType;
  isNew?: boolean;
  isDue?: boolean;
  dueAtUtc?: string | null;
  intervalDays?: number;
  accuracy?: number;
  totalReviews?: number;
  reason?: StudyPlanReason;
};

export type StudyDeck = Omit<DeckDetails, 'id' | 'cards'> & {
  id: string;
  cards: StudyCard[];
};

export function isMultipleChoiceCard(
  card: StudyCard
): card is StudyCard & { type: 'multi-choice' } {
  return card.type === 'multi-choice';
}

export type StudySessionResponse = {
  cardId: string;
  wasCorrect: boolean;
};
