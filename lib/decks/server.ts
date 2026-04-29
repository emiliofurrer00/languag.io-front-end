import 'server-only';

import { apiFetch } from '@/lib/api';
import {
  getConfiguredApiAudiences,
  getOptionalApiAccessToken,
  readAccessTokenDiagnostics,
} from '@/lib/kinde-server';
import {
  DeckDetails,
  DeckStudyRecommendation,
  DeckSummary,
  StudyPlanCard,
  emptyDeckDetails,
} from '@/lib/decks/types';

export type DeckListFilters = {
  searchQuery?: string;
  username?: string;
  owner?: string;
};

function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message.includes('Unauthorized');
}

function tokenMatchesConfiguredAudience(token: string) {
  const configuredAudiences = getConfiguredApiAudiences();
  if (configuredAudiences.length === 0) {
    return {
      matches: true,
      configuredAudiences,
      tokenAudiences: [] as string[],
      issuer: undefined as string | undefined,
      authorizedParty: undefined as string | undefined,
    };
  }

  const diagnostics = readAccessTokenDiagnostics(token);
  const tokenAudiences = diagnostics?.audiences ?? [];

  return {
    matches: tokenAudiences.some((audience) => configuredAudiences.includes(audience)),
    configuredAudiences,
    tokenAudiences,
    issuer: diagnostics?.issuer,
    authorizedParty: diagnostics?.authorizedParty,
  };
}

function buildDeckListPath(basePath: string, filters: DeckListFilters = {}) {
  const searchParams = new URLSearchParams();
  const searchQuery = filters.searchQuery?.trim();
  const ownerUsername = filters.username?.trim() || filters.owner?.trim();

  if (searchQuery) {
    searchParams.set('searchQuery', searchQuery);
  }

  if (ownerUsername) {
    searchParams.set('username', ownerUsername);
  }

  const queryString = searchParams.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

async function getPublicDecks(filters?: DeckListFilters) {
  return apiFetch<DeckSummary[]>(buildDeckListPath('/decks/public', filters), {
    cache: 'no-store',
  });
}

export async function getDecks(filters: DeckListFilters = {}) {
  if (filters.username?.trim() || filters.owner?.trim()) {
    return getPublicDecks(filters);
  }

  let accessToken: string | null;

  try {
    accessToken = await getOptionalApiAccessToken();
  } catch (error) {
    console.warn('Unable to read the Kinde access token, falling back to public decks.', error);
    return getPublicDecks(filters);
  }

  if (!accessToken) {
    return getPublicDecks(filters);
  }

  const audienceCheck = tokenMatchesConfiguredAudience(accessToken);
  if (!audienceCheck.matches) {
    console.warn(
      'Kinde access token is missing the configured API audience, falling back to public decks.',
      {
        configuredAudiences: audienceCheck.configuredAudiences,
        tokenAudiences: audienceCheck.tokenAudiences,
        authorizedParty: audienceCheck.authorizedParty,
        issuer: audienceCheck.issuer,
      }
    );

    return getPublicDecks(filters);
  }

  try {
    return apiFetch<DeckSummary[]>(buildDeckListPath('/decks', filters), {
      cache: 'no-store',
      accessToken,
    });
  } catch (error) {
    console.warn('Authenticated deck fetch failed, falling back to public decks.', error);

    return getPublicDecks(filters);
  }
}

export async function getDeckDetails(slug: string) {
  const accessToken = await getOptionalApiAccessToken();

  const fetchDeck = async (token?: string | null) =>
    apiFetch<DeckDetails>(`/decks/${slug}`, {
      cache: 'no-store',
      accessToken: token,
    });

  let deck: DeckDetails;

  try {
    deck = await fetchDeck(accessToken);
  } catch (error) {
    if (!accessToken || !isUnauthorizedError(error)) {
      throw error;
    }

    deck = await fetchDeck(null);
  }

  return {
    ...emptyDeckDetails,
    ...deck,
    color: deck.color || emptyDeckDetails.color,
    cards: deck.cards || [],
  };
}

export async function getDeckDetailsOrDefault(slug: string) {
  if (slug === 'new') {
    return emptyDeckDetails;
  }

  return getDeckDetails(slug);
}

export async function getDeckStudyPlan(deckId: string, limit = 20) {
  const accessToken = await getOptionalApiAccessToken();

  if (!accessToken) {
    return null;
  }

  try {
    return await apiFetch<StudyPlanCard[]>(`/decks/${deckId}/study-plan?limit=${limit}`, {
      cache: 'no-store',
      accessToken,
    });
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      console.warn('Unable to fetch the deck study plan.', error);
    }

    return null;
  }
}

export async function getStudyRecommendations(limit = 10) {
  const accessToken = await getOptionalApiAccessToken();

  if (!accessToken) {
    return [] as DeckStudyRecommendation[];
  }

  try {
    return await apiFetch<DeckStudyRecommendation[]>(
      `/decks/study-recommendations?limit=${limit}`,
      {
        cache: 'no-store',
        accessToken,
      }
    );
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      console.warn('Unable to fetch study recommendations.', error);
    }

    return [];
  }
}
