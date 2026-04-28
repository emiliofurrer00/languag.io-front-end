import Navbar from '@/components/profile/Navbar';
import ProfilePageContainer from '@/components/profile/ProfilePageContainer';
import { ProfileFriendshipActions } from '@/components/social/ProfileFriendshipActions';
import { buildOnboardingPath } from '@/lib/auth-flow';
import { getMyProfileIfAuthenticated, getPublicProfile } from '@/lib/profile/server';
import { notFound, redirect } from 'next/navigation';

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const normalizedUsername = username.trim();
  const viewerProfile = await getMyProfileIfAuthenticated();

  if (viewerProfile && !viewerProfile.hasBeenOnboarded) {
    redirect(buildOnboardingPath(`/profile/${normalizedUsername}`));
  }

  if (viewerProfile?.username?.trim().toLowerCase() === normalizedUsername.toLowerCase()) {
    redirect('/profile/me');
  }

  const publicProfile = await getPublicProfile(normalizedUsername);
  if (!publicProfile) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar />
      <ProfilePageContainer
        profile={publicProfile}
        createdDecksHref={`/decks?${new URLSearchParams({ username: normalizedUsername }).toString()}`}
        headerAction={
          publicProfile.id ? <ProfileFriendshipActions otherUserId={publicProfile.id} /> : null
        }
      />
    </div>
  );
}
