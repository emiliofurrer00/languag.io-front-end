import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { buildLoginRedirectPath, normalizeInternalPath } from '@/lib/auth-flow';
import { getMyProfile } from '@/lib/profile/server';
import { redirect } from 'next/navigation';

type OnboardingPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { isAuthenticated } = getKindeServerSession();
  const { next } = await searchParams;
  const nextPath = normalizeInternalPath(next);

  if (!(await isAuthenticated())) {
    redirect(buildLoginRedirectPath(nextPath));
  }

  const profile = await getMyProfile();

  if (profile.hasBeenOnboarded) {
    redirect(nextPath ?? '/decks');
  }

  return (
    <OnboardingFlow
      initialData={{
        username: profile.username ?? '',
        displayName: profile.name ?? '',
        avatarColor: profile.avatarColor,
        tagline: profile.tagline ?? '',
        aboutMe: profile.about ?? '',
        isPublicProfile: profile.isPublicProfile ?? true,
        soundsEnabled: true,
        dailyGoal:
          profile.dailyCardsGoal && profile.dailyCardsGoal > 0 ? profile.dailyCardsGoal : 15,
      }}
      nextPath={nextPath}
    />
  );
}
