import { buildApiUrl } from '@/lib/api';
import {
  getConfiguredApiAudiences,
  getMissingAudienceMessage,
  getRequiredApiAccessToken,
  readAccessTokenDiagnostics,
} from '@/lib/kinde-server';
import { NextResponse } from 'next/server';
import { rejectCrossOriginMutation } from './request-guards';

type ProxyMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ProxyOptions = {
  forwardQuery?: boolean;
  includeBody?: boolean;
};

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

export async function proxyAuthorizedApiRequest(
  request: Request,
  path: string,
  method: ProxyMethod,
  options?: ProxyOptions
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

  const { forwardQuery = false, includeBody = method !== 'GET' && method !== 'DELETE' } =
    options ?? {};
  const requestUrl = new URL(request.url);
  const targetPath = forwardQuery ? `${path}${requestUrl.search}` : path;
  const body = includeBody ? await request.text() : undefined;

  const response = await fetch(buildApiUrl(targetPath), {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${accessToken}`,
    },
    body: body || undefined,
    cache: 'no-store',
  });

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
