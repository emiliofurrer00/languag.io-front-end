import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Navbar from '@/components/profile/Navbar';
import { buildLoginRedirectPath, buildOnboardingPath } from '@/lib/auth-flow';
import ProfilePageContainer from '@/components/profile/ProfilePageContainer';
import { getMyProfile } from '@/lib/profile/server';
import { redirect } from 'next/navigation';

export default async function MyProfilePage() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(buildLoginRedirectPath('/profile/me'));
  }

  const profile = await getMyProfile();

  if (!profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/profile/me'));
  }

  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar canEdit />
      <ProfilePageContainer profile={profile} />
    </div>
  );
}
