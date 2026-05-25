import { buildApiUrl } from '@/lib/api';
import { getOptionalApiAccessToken } from '@/lib/kinde-server';
import { buildBackendUnavailableResponse } from '../backend-unavailable';
import { proxyBackendResponse } from '../proxy-authorized';

function appendQueryString(path: string, searchParams: URLSearchParams) {
  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function fetchDeckList(path: string, accessToken?: string | null) {
  try {
    return await fetch(buildApiUrl(path), {
      method: 'GET',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      cache: 'no-store',
    });
  } catch (error) {
    return buildBackendUnavailableResponse(error);
  }
}

export async function proxyDeckListRead(request: Request) {
  const requestUrl = new URL(request.url);
  const searchParams = requestUrl.searchParams;
  const ownerUsername = searchParams.get('username')?.trim() || searchParams.get('owner')?.trim();
  const publicPath = appendQueryString('/decks/public', searchParams);

  if (ownerUsername) {
    const response = await fetchDeckList(publicPath);
    return proxyBackendResponse(response);
  }

  let accessToken: string | null = null;

  try {
    accessToken = await getOptionalApiAccessToken();
  } catch {
    accessToken = null;
  }

  if (accessToken) {
    const response = await fetchDeckList(appendQueryString('/decks', searchParams), accessToken);

    if (response.status !== 401) {
      return proxyBackendResponse(response);
    }
  }

  const response = await fetchDeckList(publicPath);
  return proxyBackendResponse(response);
}
