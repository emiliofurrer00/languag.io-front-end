import SagaListContainer from '@/components/sagas/SagaListContainer';
import { buildOnboardingPath } from '@/lib/auth-flow';
import { getMyProfileIfAuthenticated } from '@/lib/profile/server';
import { getSagas } from '@/lib/sagas/server';
import { redirect } from 'next/navigation';

export default async function SagasPage() {
  const profile = await getMyProfileIfAuthenticated();

  if (profile && !profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/sagas'));
  }

  const sagas = await getSagas();

  return <SagaListContainer sagas={sagas} />;
}

