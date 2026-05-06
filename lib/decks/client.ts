import { apiFetch } from '@/lib/api';
import {
  AiDeckGenerationJob,
  CursorPage,
  DeckCard,
  DeckDetails,
  DeckStudyRecommendation,
  DeckSummary,
  StudyPlanCard,
  normalizeCursorPage,
} from '@/lib/decks/types';

export type DeckListFilters = {
  searchQuery?: string;
  username?: string;
  owner?: string;
  cursor?: string | null;
  pageSize?: number;
};

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

export type CreateAiDeckGenerationInput = {
  prompt: string;
  targetLanguage?: string;
  nativeLanguage?: string;
  difficulty: string;
  cardCount: number;
  multiChoiceCount: number;
  includeAudio: boolean;
};

type CreateAiDeckGenerationResult = {
  jobId: string;
};

function buildDeckListQuery(filters: DeckListFilters = {}) {
  const searchParams = new URLSearchParams();
  const searchQuery = filters.searchQuery?.trim();
  const ownerUsername = filters.username?.trim() || filters.owner?.trim();

  if (searchQuery) {
    searchParams.set('searchQuery', searchQuery);
  }

  if (ownerUsername) {
    searchParams.set('username', ownerUsername);
  }

  if (filters.cursor?.trim()) {
    searchParams.set('cursor', filters.cursor.trim());
  }

  if (filters.pageSize && Number.isFinite(filters.pageSize)) {
    searchParams.set('pageSize', String(filters.pageSize));
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : '';
}

function normalizeDeckCardsForSave(cards: DeckCard[]) {
  return (cards || []).map((card, index) => ({
    ...(card.id ? { id: card.id } : {}),
    type: card.type ?? 'flashcard',
    frontText: card.frontText,
    backText: card.backText,
    exampleSentence: card.exampleSentence,
    choices:
      card.type === 'multi-choice'
        ? (card.choices || []).map((choice, choiceIndex) => ({
            ...(choice.id ? { id: choice.id } : {}),
            text: choice.text,
            isCorrect: choice.isCorrect,
            order: choice.order ?? choiceIndex,
          }))
        : [],
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

export async function getDeckPage(
  filters: DeckListFilters = {}
): Promise<CursorPage<DeckSummary>> {
  const response = await apiFetch<unknown>(`/api/decks${buildDeckListQuery(filters)}`, {
    method: 'GET',
    useApiBaseUrl: false,
    cache: 'no-store',
  });

  return normalizeCursorPage<DeckSummary>(response);
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
  return apiFetch<DeckStudyRecommendation[]>(`/api/decks/study-recommendations?limit=${limit}`, {
    method: 'GET',
    useApiBaseUrl: false,
  });
}

export async function createAiDeckGenerationJob(input: CreateAiDeckGenerationInput) {
  return apiFetch<CreateAiDeckGenerationResult>('/api/ai/deck-generations', {
    method: 'POST',
    body: JSON.stringify(input),
    useApiBaseUrl: false,
  });
}

export async function getAiDeckGenerationJob(jobId: string) {
  return apiFetch<AiDeckGenerationJob>(`/api/ai/deck-generations/${jobId}`, {
    method: 'GET',
    useApiBaseUrl: false,
    cache: 'no-store',
  });
}
