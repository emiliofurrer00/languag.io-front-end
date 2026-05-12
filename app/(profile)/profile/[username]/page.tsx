import type { Metadata } from 'next';
import Navbar from '@/components/profile/Navbar';
import ProfilePageContainer from '@/components/profile/ProfilePageContainer';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProfileFriendshipActions } from '@/components/social/ProfileFriendshipActions';
import { buildOnboardingPath } from '@/lib/auth-flow';
import { getMyProfileIfAuthenticated, getPublicProfile } from '@/lib/profile/server';
import { buildAbsoluteUrl, createNoIndexMetadata, createPageMetadata } from '@/lib/seo';
import { notFound, redirect } from 'next/navigation';

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const normalizedUsername = username.trim();

  try {
    const publicProfile = await getPublicProfile(normalizedUsername);

    if (!publicProfile) {
      return createNoIndexMetadata('Profile not found');
    }

    const handle = publicProfile.handle ? `@${publicProfile.handle.replace(/^@/, '')}` : null;
    const deckCount = publicProfile.stats.decksCreated;
    const fallbackDescription = `${publicProfile.name}${handle ? ` (${handle})` : ''} has created ${deckCount} public ${deckCount === 1 ? 'deck' : 'decks'} on Languag.io.`;

    return createPageMetadata({
      title: `${publicProfile.name} - Languag.io creator profile`,
      description: publicProfile.tagline || publicProfile.bio || fallbackDescription,
      path: `/profile/${encodeURIComponent(normalizedUsername)}`,
      type: 'profile',
    });
  } catch {
    return createNoIndexMetadata('Profile not found');
  }
}

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
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          url: buildAbsoluteUrl(`/profile/${encodeURIComponent(normalizedUsername)}`),
          mainEntity: {
            '@type': 'Person',
            name: publicProfile.name,
            alternateName: publicProfile.handle
              ? `@${publicProfile.handle.replace(/^@/, '')}`
              : undefined,
            description: publicProfile.tagline || publicProfile.bio || undefined,
            image: publicProfile.profilePictureUrl || undefined,
          },
        }}
      />
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
