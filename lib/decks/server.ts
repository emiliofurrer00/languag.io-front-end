import 'server-only';

import { apiFetch } from '@/lib/api';
import {
  getConfiguredApiAudiences,
  getOptionalApiAccessToken,
  readAccessTokenDiagnostics,
} from '@/lib/kinde-server';
import { DeckDetails, DeckSummary, emptyDeckDetails } from '@/lib/decks/types';

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

async function getPublicDecks() {
  return apiFetch<DeckSummary[]>('/decks/public', {
    cache: 'no-store',
  });
}

export async function getDecks() {
  let accessToken: string | null;

  try {
    accessToken = await getOptionalApiAccessToken();
  } catch (error) {
    console.warn('Unable to read the Kinde access token, falling back to public decks.', error);
    return getPublicDecks();
  }

  if (!accessToken) {
    return getPublicDecks();
  }

  const audienceCheck = tokenMatchesConfiguredAudience(accessToken);
  if (!audienceCheck.matches) {
    console.warn('Kinde access token is missing the configured API audience, falling back to public decks.', {
      configuredAudiences: audienceCheck.configuredAudiences,
      tokenAudiences: audienceCheck.tokenAudiences,
      authorizedParty: audienceCheck.authorizedParty,
      issuer: audienceCheck.issuer,
    });

    return getPublicDecks();
  }

  try {
    return apiFetch<DeckSummary[]>('/decks', {
      cache: 'no-store',
      accessToken,
    });
  } catch (error) {
    console.warn('Authenticated deck fetch failed, falling back to public decks.', error);

    return getPublicDecks();
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
