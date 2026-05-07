import { buildOnboardingPath } from '@/lib/auth-flow';
import DeckListContainer from '@/components/decks-list/DeckListContainer';
import { getDeckPage, getStudyRecommendations } from '@/lib/decks/server';
import { getMyProfileIfAuthenticated } from '@/lib/profile/server';
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
  const profile = await getMyProfileIfAuthenticated();

  if (profile && !profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/decks'));
  }

  const [deckPage, studyRecommendations] = await Promise.all([
    getDeckPage({
      searchQuery,
      username: ownerUsername,
      cursor,
      pageSize,
    }),
    ownerUsername ? Promise.resolve([]) : getStudyRecommendations(),
  ]);

  return (
    <DeckListContainer
      decks={deckPage.items}
      nextCursor={deckPage.nextCursor}
      studyRecommendations={studyRecommendations}
      currentUsername={profile?.username}
      isAuthenticated={Boolean(profile)}
      filters={{ searchQuery, ownerUsername, pageSize }}
    />
  );
}
