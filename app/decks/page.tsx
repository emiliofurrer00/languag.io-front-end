import { buildOnboardingPath } from '@/lib/auth-flow';
import DeckListContainer from '@/components/decks-list/DeckListContainer';
import { getDecks } from '@/lib/decks/server';
import { getMyProfileIfAuthenticated } from '@/lib/profile/server';
import { redirect } from 'next/navigation';

export default async function DecksPage() {
  const profile = await getMyProfileIfAuthenticated();

  if (profile && !profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/decks'));
  }

  const decks = await getDecks();

  return <DeckListContainer decks={decks} />;
}
