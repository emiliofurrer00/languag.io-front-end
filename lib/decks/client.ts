import { apiFetch } from '@/lib/api';
import {
  DeckCard,
  DeckDetails,
  DeckStudyRecommendation,
  StudyPlanCard,
} from '@/lib/decks/types';

type SaveDeckOptions = {
  deck: DeckDetails;
  isNew: boolean;
};

type SubmitStudySessionResponsePayload = {
  cardId: string;
  wasCorrect: boolean;
};

type SubmitStudySessionOptions = {
  deckId: string;
  percentageCorrect: number;
  responses: SubmitStudySessionResponsePayload[];
};

type SubmitStudySessionResult = {
  studySessionId: string;
};

function normalizeDeckCardsForSave(cards: DeckCard[]) {
  return (cards || []).map((card, index) => ({
    ...(card.id ? { id: card.id } : {}),
    frontText: card.frontText,
    backText: card.backText,
    exampleSentence: card.exampleSentence,
    order: card.order ?? index,
  }));
}

export async function saveDeck({ deck, isNew }: SaveDeckOptions) {
  const payload = {
    title: deck.title,
    description: deck.description,
    category: deck.category || 'Language',
    color: deck.color,
    visibility: deck.visibility,
    cards: normalizeDeckCardsForSave(deck.cards || []),
  };

  const path = isNew ? '/api/decks' : `/api/decks/${deck.id}`;

  await apiFetch(path, {
    method: isNew ? 'POST' : 'PUT',
    body: JSON.stringify(payload),
    useApiBaseUrl: false,
  });

  return true;
}

export async function submitStudySession({
  deckId,
  percentageCorrect,
  responses,
}: SubmitStudySessionOptions) {
  return apiFetch<SubmitStudySessionResult>(`/api/decks/${deckId}/study-sessions`, {
    method: 'POST',
    body: JSON.stringify({
      percentageCorrect,
      responses,
    }),
    useApiBaseUrl: false,
  });
}

export async function getDeckStudyPlan(deckId: string, limit = 20) {
  return apiFetch<StudyPlanCard[]>(`/api/decks/${deckId}/study-plan?limit=${limit}`, {
    method: 'GET',
    useApiBaseUrl: false,
  });
}

export async function getStudyRecommendations(limit = 10) {
  return apiFetch<DeckStudyRecommendation[]>(
    `/api/decks/study-recommendations?limit=${limit}`,
    {
      method: 'GET',
      useApiBaseUrl: false,
    }
  );
}
