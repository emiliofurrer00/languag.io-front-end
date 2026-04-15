import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import DeckEditorContainer from '@/components/create-form/DeckEditorContainer';
import { buildLoginRedirectPath, buildOnboardingPath } from '@/lib/auth-flow';
import { getDeckDetailsOrDefault } from '@/lib/decks/server';
import { getMyProfile } from '@/lib/profile/server';
import { redirect } from 'next/navigation';

type CreateDeckPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CreateDeckPage({ params }: CreateDeckPageProps) {
  const { slug } = await params;
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();
  const editorPath = `/decks/editor/${slug}`;

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

  const defaultData = await getDeckDetailsOrDefault(slug);

  return <DeckEditorContainer defaultDeckDetails={defaultData} />;
}
