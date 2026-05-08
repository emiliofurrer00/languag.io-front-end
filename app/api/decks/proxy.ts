import { buildApiUrl } from '@/lib/api';
import {
  getConfiguredApiAudiences,
  getMissingAudienceMessage,
  getOptionalApiAccessToken,
  getRequiredApiAccessToken,
  readAccessTokenDiagnostics,
} from '@/lib/kinde-server';
import { NextResponse } from 'next/server';
import { buildBackendUnavailableResponse } from '../backend-unavailable';
import { rejectCrossOriginMutation } from '../request-guards';

async function proxyBackendResponse(response: Response) {
  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  const text = await response.text();
  const contentType = response.headers.get('Content-Type');

  return new Response(text, {
    status: response.status,
    headers: contentType ? { 'Content-Type': contentType } : undefined,
  });
}

function buildRejectedTokenResponse(accessToken: string) {
  const diagnostics = readAccessTokenDiagnostics(accessToken);
  console.warn('The backend rejected the Kinde access token.', {
    configuredAudiences: getConfiguredApiAudiences(),
    tokenAudiences: diagnostics?.audiences ?? [],
    authorizedParty: diagnostics?.authorizedParty,
    issuer: diagnostics?.issuer,
    subject: diagnostics?.subject,
  });

  return NextResponse.json(
    {
      message:
        'The backend rejected the Kinde access token. Make sure KINDE_AUDIENCE and the API Authentication:Kinde:Audience use the same Kinde API audience value.',
    },
    { status: 401 }
  );
}

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

export async function proxyAuthorizedDeckWrite(
  request: Request,
  path: string,
  method: 'POST' | 'PUT'
) {
  const crossOriginRejection = rejectCrossOriginMutation(request);
  if (crossOriginRejection) {
    return crossOriginRejection;
  }

  let accessToken: string;

  try {
    accessToken = await getRequiredApiAccessToken();
  } catch {
    return NextResponse.json({ message: getMissingAudienceMessage() }, { status: 401 });
  }

  const body = await request.text();
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: body || undefined,
      cache: 'no-store',
    });
  } catch (error) {
    response = buildBackendUnavailableResponse(error);
  }

  if (response.status === 401) {
    return buildRejectedTokenResponse(accessToken);
  }

  return proxyBackendResponse(response);
}
