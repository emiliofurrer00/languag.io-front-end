import { DeckCard, DeckDetails, StudyPlanReason } from '@/lib/decks/types';

export type StudyFlashCard = DeckCard & {
  id: string;
  isNew?: boolean;
  isDue?: boolean;
  dueAtUtc?: string | null;
  intervalDays?: number;
  accuracy?: number;
  totalReviews?: number;
  reason?: StudyPlanReason;
};

export type StudyMultipleChoiceCard = {
  id: string;
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StudyCard = StudyFlashCard | StudyMultipleChoiceCard;

export type StudyDeck = Omit<DeckDetails, 'id' | 'cards'> & {
  id: string;
  cards: StudyFlashCard[];
};

export function isMultipleChoiceCard(card: StudyCard): card is StudyMultipleChoiceCard {
  return 'type' in card && card.type === 'multiple-choice';
}

export type StudySessionResponse = {
  cardId: string;
  wasCorrect: boolean;
};
