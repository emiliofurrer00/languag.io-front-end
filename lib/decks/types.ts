export type DeckCard = {
  frontText: string;
  backText: string;
};

export type DeckDetails = {
  title: string;
  description: string;
  category: string;
  color: string;
  visibility: number;
  id?: string;
  cards: DeckCard[];
};

export type DeckSummary = DeckDetails & {
  id: string;
};

export const emptyDeckDetails: DeckDetails = {
  title: '',
  description: '',
  category: '',
  color: 'teal',
  visibility: 1,
  cards: [],
};
