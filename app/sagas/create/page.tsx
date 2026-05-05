import SagaEditorContainer from '@/components/sagas/SagaEditorContainer';
import { buildLoginRedirectPath, buildOnboardingPath } from '@/lib/auth-flow';
import { getDecks } from '@/lib/decks/server';
import { getMyProfile } from '@/lib/profile/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function CreateSagaPage() {
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();
  const editorPath = '/sagas/create';

  if (!(await isAuthenticated())) {
    redirect(buildLoginRedirectPath(editorPath));
  }

  const profile = await getMyProfile();

  if (!profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath(editorPath));
  }

  const accessToken = await getAccessTokenRaw();
  if (!accessToken) {
    throw new Error(
      'Authenticated Kinde session is missing an API access token. Set KINDE_AUDIENCE to your backend API audience.'
    );
  }

  const decks = await getDecks();

  return <SagaEditorContainer availableDecks={decks} />;
}

