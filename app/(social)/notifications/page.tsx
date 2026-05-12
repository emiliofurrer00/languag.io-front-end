import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import { NotificationsPageClient } from '@/components/social/NotificationsPageClient';
import Navbar from '@/components/profile/Navbar';
import { buildLoginRedirectPath, buildOnboardingPath } from '@/lib/auth-flow';
import { getMyProfile } from '@/lib/profile/server';
import { createNoIndexMetadata } from '@/lib/seo';

export const metadata = createNoIndexMetadata('Notifications');

export default async function NotificationsPage() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(buildLoginRedirectPath('/notifications'));
  }

  const profile = await getMyProfile();

  if (!profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/notifications'));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar title="Notifications" />
      <NotificationsPageClient />
    </div>
  );
}
