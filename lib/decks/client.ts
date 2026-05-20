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

export type CreatedDeckResult = DeckDetails & {
  id: string;
};

type SubmitStudySessionResponsePayload = {
  cardId: string;
  wasCorrect: boolean;
};

type SubmitStudySessionOptions = {
  deckId: string;
  deckVersionId?: string;
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

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readCreatedDeckPayload(value: unknown): Record<string, unknown> | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  return asRecord(record.deck) ?? asRecord(record.data) ?? asRecord(record.createdDeck) ?? record;
}

function readCreatedDeckId(value: unknown) {
  if (typeof value === 'string') {
    return readString(value);
  }

  const record = asRecord(value);
  const payload = readCreatedDeckPayload(value);

  return (
    readString(payload?.id) ??
    readString(payload?.deckId) ??
    readString(payload?.createdDeckId) ??
    readString(record?.id) ??
    readString(record?.deckId) ??
    readString(record?.createdDeckId)
  );
}

function normalizeCreatedDeck(value: unknown, fallbackDeck: DeckDetails): CreatedDeckResult {
  const id = readCreatedDeckId(value);

  if (!id) {
    throw new Error('The deck was created, but the backend did not return a deck id.');
  }

  const payload = readCreatedDeckPayload(value);
  const deckPayload = (payload ?? {}) as Partial<DeckDetails>;
  const cards = Array.isArray(payload?.cards) ? (payload.cards as DeckCard[]) : fallbackDeck.cards;

  return {
    ...fallbackDeck,
    ...deckPayload,
    id,
    cards,
  };
}

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

function buildDeckSavePayload(deck: DeckDetails) {
  return {
    title: deck.title,
    description: deck.description,
    category: deck.category || 'Language',
    color: deck.color,
    visibility: deck.visibility,
    cards: normalizeDeckCardsForSave(deck.cards || []),
  };
}

export async function createDeck(deck: DeckDetails) {
  const response = await apiFetch<unknown>('/api/decks', {
    method: 'POST',
    body: JSON.stringify(buildDeckSavePayload(deck)),
    useApiBaseUrl: false,
  });

  return normalizeCreatedDeck(response, deck);
}

export async function saveDeck({ deck, isNew }: SaveDeckOptions) {
  const payload = buildDeckSavePayload(deck);

  const path = isNew ? '/api/decks' : `/api/decks/${deck.id}`;

  if (isNew) {
    await createDeck(deck);
  } else {
    await apiFetch(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
      useApiBaseUrl: false,
    });
  }

  return true;
}

export async function getDeckPage(filters: DeckListFilters = {}): Promise<CursorPage<DeckSummary>> {
  const response = await apiFetch<unknown>(`/api/decks${buildDeckListQuery(filters)}`, {
    method: 'GET',
    useApiBaseUrl: false,
    cache: 'no-store',
  });

  return normalizeCursorPage<DeckSummary>(response);
}

export async function submitStudySession({
  deckId,
  deckVersionId,
  percentageCorrect,
  responses,
}: SubmitStudySessionOptions) {
  return apiFetch<SubmitStudySessionResult>(`/api/decks/${deckId}/study-sessions`, {
    method: 'POST',
    body: JSON.stringify({
      deckVersionId,
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
