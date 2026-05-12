import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import Navbar from '@/components/profile/Navbar';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { buildLoginRedirectPath, buildOnboardingPath } from '@/lib/auth-flow';
import { getMyProfile } from '@/lib/profile/server';
import { createNoIndexMetadata } from '@/lib/seo';

export const metadata = createNoIndexMetadata('Edit profile');

export default async function EditMyProfilePage() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(buildLoginRedirectPath('/profile/me/edit'));
  }

  const profile = await getMyProfile();

  if (!profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/profile/me/edit'));
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar title="Edit Profile" backHref="/profile/me" />
      <ProfileEditForm profile={profile} />
    </div>
  );
}
