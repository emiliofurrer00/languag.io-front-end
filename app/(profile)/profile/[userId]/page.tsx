import Navbar from '@/components/profile/Navbar';
import ProfilePageContainer from '@/components/profile/ProfilePageContainer';
import NeoBox from '@/components/ui/NeoBox';
import { buildPendingPublicProfile, getPublicProfile } from '@/lib/profile/server';

type PublicProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { userId } = await params;
  const publicProfile = await getPublicProfile(userId);
  const profile = publicProfile ?? buildPendingPublicProfile(userId);

  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar />
      {!publicProfile ? (
        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
          <NeoBox
            padding="p-4"
            alignItems="start"
            justifyContent="start"
            className="bg-secondary"
            shadowOffset="4px"
          >
            <p className="font-display text-lg font-semibold">
              Public profile endpoint coming soon
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This route is live and ready for the backend public-profile endpoint. Once that
              endpoint is added, this page will render the fetched public profile instead of this
              placeholder state.
            </p>
          </NeoBox>
        </div>
      ) : null}
      <ProfilePageContainer profile={profile} />
    </div>
  );
}
