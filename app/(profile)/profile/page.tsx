import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Navbar from '@/components/profile/Navbar';
import ProfilePageContainer from '@/components/profile/ProfilePageContainer';
import { getMyProfile } from '@/lib/profile/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent('/profile')}`);
  }

  const profile = await getMyProfile();

  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar />
      <ProfilePageContainer profile={profile} />
    </div>
  );
}
