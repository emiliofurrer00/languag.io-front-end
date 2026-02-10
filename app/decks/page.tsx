import DeckListContainer from '@/components/decks-list/DeckListContainer';
import { DeckDetails } from './editor/[slug]/page';

type DeckList = Array<DeckDetails & { cardCount: number; id: string }>;

async function fetchDecks(): Promise<DeckList> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks/public`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export default async function DecksPage() {
  const decks = await fetchDecks();
  console.log('Fetched decks:', decks);

  return <DeckListContainer decks={decks} />;
}
