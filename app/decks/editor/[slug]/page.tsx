import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import DeckEditorContainer from '@/components/create-form/DeckEditorContainer';
import { getDeckDetailsOrDefault } from '@/lib/decks/server';
import { redirect } from 'next/navigation';

type CreateDeckPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CreateDeckPage({ params }: CreateDeckPageProps) {
  const { slug } = await params;
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(`/decks/editor/${slug}`)}`);
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
