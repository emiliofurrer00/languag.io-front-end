import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { buildOnboardingPath, normalizeInternalPath } from '@/lib/auth-flow';
import { getMyProfile } from '@/lib/profile/server';
import { redirect } from 'next/navigation';

type AuthContinuePageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AuthContinuePage({ searchParams }: AuthContinuePageProps) {
  const { isAuthenticated } = getKindeServerSession();
  const { next } = await searchParams;
  const nextPath = normalizeInternalPath(next);

  if (!(await isAuthenticated())) {
    redirect('/');
  }

  const profile = await getMyProfile();

  if (!profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath(nextPath));
  }

  redirect(nextPath ?? '/decks');
}
