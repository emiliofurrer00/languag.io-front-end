export type DeckCard = {
  id?: string;
  frontText: string;
  backText: string;
  order?: number;
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
