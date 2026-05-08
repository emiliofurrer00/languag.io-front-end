import { buildApiUrl } from '@/lib/api';
import {
  getConfiguredApiAudiences,
  getMissingAudienceMessage,
  getRequiredApiAccessToken,
  readAccessTokenDiagnostics,
} from '@/lib/kinde-server';
import { NextResponse } from 'next/server';
import { buildBackendUnavailableResponse } from '../backend-unavailable';
import { rejectCrossOriginMutation } from '../request-guards';

function buildUnauthorizedResponse() {
  return NextResponse.json(
    { message: getMissingAudienceMessage() },
    {
      status: 401,
    }
  );
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

export async function proxyAuthorizedUserRequest(
  request: Request,
  path: string,
  method: 'GET' | 'PUT'
) {
  const crossOriginRejection = rejectCrossOriginMutation(request);
  if (crossOriginRejection) {
    return crossOriginRejection;
  }

  let accessToken: string;

  try {
    accessToken = await getRequiredApiAccessToken();
  } catch {
    return buildUnauthorizedResponse();
  }

  const body = method === 'PUT' ? await request.text() : undefined;
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers: {
        ...(method === 'PUT' ? { 'Content-Type': 'application/json' } : {}),
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
