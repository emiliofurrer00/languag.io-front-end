import { buildApiUrl } from '@/lib/api';
import {
  getConfiguredApiAudiences,
  getMissingAudienceMessage,
  getRequiredApiAccessToken,
  readAccessTokenDiagnostics,
} from '@/lib/kinde-server';
import { NextResponse } from 'next/server';

export async function proxyAuthorizedDeckWrite(request: Request, path: string, method: 'POST' | 'PUT') {
  let accessToken: string;

  try {
    accessToken = await getRequiredApiAccessToken();
  } catch {
    return NextResponse.json({ message: getMissingAudienceMessage() }, { status: 401 });
  }

  const body = await request.text();
  const response = await fetch(buildApiUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: body || undefined,
    cache: 'no-store',
  });

  if (response.status === 401) {
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
