import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import GetStartedFlow from '@/components/get-started/GetStartedFlow';
import {
  buildLoginRedirectPath,
  buildOnboardingPath,
  normalizeInternalPath,
} from '@/lib/auth-flow';
import { getMyProfile } from '@/lib/profile/server';
import { createNoIndexMetadata } from '@/lib/seo';

type GetStartedPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export const metadata = createNoIndexMetadata('Get started');

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'there';
}

export default async function GetStartedPage({ searchParams }: GetStartedPageProps) {
  const { isAuthenticated } = getKindeServerSession();
  const { next } = await searchParams;
  const nextPath = normalizeInternalPath(next);
  const getStartedPath = nextPath
    ? `/get-started?next=${encodeURIComponent(nextPath)}`
    : '/get-started';

  if (!(await isAuthenticated())) {
    redirect(buildLoginRedirectPath(getStartedPath));
  }

  const profile = await getMyProfile();

  if (!profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath(getStartedPath));
  }

  return (
    <GetStartedFlow
      firstName={getFirstName(profile.name)}
      dailyGoal={profile.dailyCardsGoal && profile.dailyCardsGoal > 0 ? profile.dailyCardsGoal : 15}
      nextPath={nextPath ?? '/feed'}
    />
  );
}
