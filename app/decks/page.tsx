import DeckListContainer from '@/components/decks-list/DeckListContainer';
import { getDecks } from '@/lib/decks/server';

export default async function DecksPage() {
  const decks = await getDecks();

  return <DeckListContainer decks={decks} />;
}
