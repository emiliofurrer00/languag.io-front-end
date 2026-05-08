import SagaListContainer from '@/components/sagas/SagaListContainer';
import { buildOnboardingPath } from '@/lib/auth-flow';
import { getApiErrorDisplayMessage } from '@/lib/api';
import { getMyProfileIfAuthenticated } from '@/lib/profile/server';
import type { ProfileData } from '@/lib/profile/types';
import { getSagas } from '@/lib/sagas/server';
import type { Saga } from '@/lib/sagas/types';
import { redirect } from 'next/navigation';

export default async function SagasPage() {
  let profile: ProfileData | null = null;
  let serviceError: string | null = null;

  try {
    profile = await getMyProfileIfAuthenticated();
  } catch (error) {
    serviceError = getApiErrorDisplayMessage(error);
  }

  if (profile && !profile.hasBeenOnboarded) {
    redirect(buildOnboardingPath('/sagas'));
  }

  let sagas: Saga[] = [];

  if (!serviceError) {
    try {
      sagas = await getSagas();
    } catch (error) {
      serviceError = getApiErrorDisplayMessage(error);
    }
  }

  return <SagaListContainer sagas={sagas} serviceError={serviceError} />;
}
