import { buildOnboardingPath } from '@/lib/auth-flow';
import DeckListContainer from '@/components/decks-list/DeckListContainer';
import { getDeckPage } from '@/lib/decks/server';
import type { CursorPage, DeckSummary } from '@/lib/decks/types';
import { getApiErrorDisplayMessage } from '@/lib/api';
import { getMyProfileIfAuthenticated } from '@/lib/profile/server';
import type { ProfileData } from '@/lib/profile/types';
import { createPageMetadata } from '@/lib/seo';
import { redirect } from 'next/navigation';

type DecksPageProps = {
  searchParams?: Promise<{
    searchQuery?: string;
    search?: string;
    q?: string;
    username?: string;
    owner?: string;
    cursor?: string;
    pageSize?: string;
  }>;
};

export const metadata = createPageMetadata({
  title: 'Public flashcard decks',
  description:
    'Browse community flashcard decks for languages, programming, science, history, and other subjects you want to remember.',
  path: '/decks',
});

function firstParamValue(...values: Array<string | undefined>) {
  return values.find((value) => value?.trim())?.trim();
}

function parsePageSize(value?: string) {
  if (!value) {
    return undefined;
  }

  const pageSize = Number.parseInt(value, 10);
  return Number.isFinite(pageSize) && pageSize > 0 ? pageSize : undefined;
}

export default async function DecksPage({ searchParams }: DecksPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const searchQuery = firstParamValue(params?.searchQuery, params?.search, params?.q);
  const ownerUsername = firstParamValue(params?.username, params?.owner);
  const cursor = firstParamValue(params?.cursor);
  const pageSize = parsePageSize(params?.pageSize);
  let profile: ProfileData | null = null;
  let serviceError: string | null = null;

  try {
    profile = await getMyProfileIfAuthenticated();
  } catch (error) {
    serviceError = getApiErrorDisplayMessage(error);
  }

  if (profile && !profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/decks'));
  }

  let deckPage: CursorPage<DeckSummary> = { items: [], nextCursor: null };

  if (!serviceError) {
    try {
      deckPage = await getDeckPage({
        searchQuery,
        username: ownerUsername,
        cursor,
        pageSize,
      });
    } catch (error) {
      serviceError = getApiErrorDisplayMessage(error);
    }
  }

  return (
    <DeckListContainer
      decks={deckPage.items}
      nextCursor={deckPage.nextCursor}
      currentUsername={profile?.username}
      isAuthenticated={Boolean(profile)}
      serviceError={serviceError}
      filters={{ searchQuery, ownerUsername, pageSize }}
    />
  );
}
