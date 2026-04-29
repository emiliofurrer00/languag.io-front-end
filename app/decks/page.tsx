import { buildOnboardingPath } from '@/lib/auth-flow';
import DeckListContainer from '@/components/decks-list/DeckListContainer';
import { getDecks, getStudyRecommendations } from '@/lib/decks/server';
import { getMyProfileIfAuthenticated } from '@/lib/profile/server';
import { redirect } from 'next/navigation';

type DecksPageProps = {
  searchParams?: Promise<{
    searchQuery?: string;
    search?: string;
    q?: string;
    username?: string;
    owner?: string;
  }>;
};

function firstParamValue(...values: Array<string | undefined>) {
  return values.find((value) => value?.trim())?.trim();
}

export default async function DecksPage({ searchParams }: DecksPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const searchQuery = firstParamValue(params?.searchQuery, params?.search, params?.q);
  const ownerUsername = firstParamValue(params?.username, params?.owner);
  const profile = await getMyProfileIfAuthenticated();

  if (profile && !profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/decks'));
  }

  const [decks, studyRecommendations] = await Promise.all([
    getDecks({
      searchQuery,
      username: ownerUsername,
    }),
    ownerUsername ? Promise.resolve([]) : getStudyRecommendations(),
  ]);

  return (
    <DeckListContainer
      decks={decks}
      studyRecommendations={studyRecommendations}
      filters={{ searchQuery, ownerUsername }}
    />
  );
}
