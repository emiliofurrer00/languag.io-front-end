import { apiFetch } from '@/lib/api';
import { DeckDetails } from '@/lib/decks/types';

type SaveDeckOptions = {
  deck: DeckDetails;
  isNew: boolean;
};

export async function saveDeck({ deck, isNew }: SaveDeckOptions) {
  const payload = {
    title: deck.title,
    description: deck.description,
    category: deck.category || 'Language',
    color: deck.color,
    visibility: deck.visibility,
    cards: deck.cards || [],
  };

  const path = isNew ? '/api/decks' : `/api/decks/${deck.id}`;

  await apiFetch(path, {
    method: isNew ? 'POST' : 'PUT',
    body: JSON.stringify(payload),
    useApiBaseUrl: false,
  });

  return true;
}
