import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { buildOnboardingPath, normalizeInternalPath } from '@/lib/auth-flow';
import { getMyProfile } from '@/lib/profile/server';
import { createNoIndexMetadata } from '@/lib/seo';
import { redirect } from 'next/navigation';

type AuthContinuePageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export const metadata = createNoIndexMetadata('Continue sign in');

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

  redirect(nextPath ?? '/feed');
}
