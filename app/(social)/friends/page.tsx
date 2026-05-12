import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import { FriendsPageClient } from '@/components/social/FriendsPageClient';
import Navbar from '@/components/profile/Navbar';
import { buildLoginRedirectPath, buildOnboardingPath } from '@/lib/auth-flow';
import { getMyProfile } from '@/lib/profile/server';
import { createNoIndexMetadata } from '@/lib/seo';

export const metadata = createNoIndexMetadata('Friends');

type FriendsPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

function normalizeTab(value?: string) {
  return value === 'incoming' || value === 'outgoing' ? value : 'friends';
}

export default async function FriendsPage({ searchParams }: FriendsPageProps) {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(buildLoginRedirectPath('/friends'));
  }

  const profile = await getMyProfile();

  if (!profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/friends'));
  }

  const params = searchParams ? await searchParams : undefined;
  const initialTab = normalizeTab(params?.tab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar title="Friends" />
      <FriendsPageClient initialTab={initialTab} />
    </div>
  );
}
