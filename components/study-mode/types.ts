import { DeckDetails } from '@/lib/decks/types';

export type StudyFlashCard = {
  id: string;
  frontText: string;
  backText: string;
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

export type StudyDeck = Omit<DeckDetails, 'cards'> & {
  cards: StudyCard[];
};

export function isMultipleChoiceCard(card: StudyCard): card is StudyMultipleChoiceCard {
  return 'type' in card && card.type === 'multiple-choice';
}
