import 'server-only';

import { apiFetch } from '@/lib/api';
import { getOptionalApiAccessToken } from '@/lib/kinde-server';
import { Saga } from './types';

function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message.includes('Unauthorized');
}

function isDynamicServerUsageError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    String((error as { digest?: unknown }).digest).includes('DYNAMIC_SERVER_USAGE')
  );
}

async function getPublicSagas() {
  return apiFetch<Saga[]>('/sagas/public', {
    cache: 'no-store',
  });
}

export async function getSagas() {
  let accessToken: string | null;

  try {
    accessToken = await getOptionalApiAccessToken();
  } catch (error) {
    console.warn('Unable to read the Kinde access token, falling back to public sagas.', error);
    return getPublicSagas();
  }

  if (!accessToken) {
    return getPublicSagas();
  }

  try {
    return await apiFetch<Saga[]>('/sagas', {
      cache: 'no-store',
      accessToken,
    });
  } catch (error) {
    if (isDynamicServerUsageError(error)) {
      throw error;
    }

    if (!isUnauthorizedError(error)) {
      console.warn('Authenticated saga fetch failed, falling back to public sagas.', error);
    }

    return getPublicSagas();
  }
}

export async function getSagaDetails(sagaId: string) {
  let accessToken: string | null;

  try {
    accessToken = await getOptionalApiAccessToken();
  } catch {
    accessToken = null;
  }

  const fetchSaga = async (token?: string | null) =>
    apiFetch<Saga>(`/sagas/${sagaId}`, {
      cache: 'no-store',
      accessToken: token,
    });

  try {
    return await fetchSaga(accessToken);
  } catch (error) {
    if (!accessToken || !isUnauthorizedError(error)) {
      throw error;
    }

    return fetchSaga(null);
  }
}
