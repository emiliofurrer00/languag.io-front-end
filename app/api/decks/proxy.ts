import { buildApiUrl } from '@/lib/api';
import {
  getConfiguredApiAudiences,
  getMissingAudienceMessage,
  getRequiredApiAccessToken,
  readAccessTokenDiagnostics,
} from '@/lib/kinde-server';
import { NextResponse } from 'next/server';
import { rejectCrossOriginMutation } from '../request-guards';

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function normalizeUsername(value: unknown) {
  return firstString(value)?.replace(/^@/, '').toLowerCase();
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

async function fetchBackendJson(path: string, accessToken: string) {
  const response = await fetch(buildApiUrl(path), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return {
      response,
      data: null,
    };
  }

  return {
    response,
    data: (await response.json()) as unknown,
  };
}

function readDeckOwnerUsername(deck: unknown) {
  const root = asRecord(deck) ?? {};
  const owner = asRecord(root.owner) ?? asRecord(root.creator) ?? asRecord(root.user) ?? {};

  return normalizeUsername(
    firstString(
      root.ownerUsername,
      root.ownerUserName,
      root.ownerHandle,
      owner.username,
      owner.userName,
      owner.handle
    )
  );
}

async function rejectUnauthorizedDeckUpdate(path: string, accessToken: string) {
  const currentUserResult = await fetchBackendJson('/Users/me', accessToken);

  if (currentUserResult.response.status === 401) {
    return buildRejectedTokenResponse(accessToken);
  }

  if (!currentUserResult.response.ok) {
    return proxyBackendResponse(currentUserResult.response);
  }

  const currentUserRecord = asRecord(currentUserResult.data) ?? {};
  const currentUsername = normalizeUsername(currentUserRecord.username);

  if (!currentUsername) {
    return NextResponse.json(
      { message: 'Unable to verify the current user for this deck update.' },
      { status: 403 }
    );
  }

  const deckResult = await fetchBackendJson(path, accessToken);

  if (deckResult.response.status === 401) {
    return buildRejectedTokenResponse(accessToken);
  }

  if (!deckResult.response.ok) {
    return proxyBackendResponse(deckResult.response);
  }

  const deckOwnerUsername = readDeckOwnerUsername(deckResult.data);

  if (!deckOwnerUsername) {
    return NextResponse.json(
      { message: 'Unable to verify deck ownership for this update.' },
      { status: 403 }
    );
  }

  if (deckOwnerUsername !== currentUsername) {
    return NextResponse.json(
      { message: 'Only the deck owner can edit this deck.' },
      { status: 403 }
    );
  }

  return null;
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

  if (method === 'PUT') {
    const ownershipRejection = await rejectUnauthorizedDeckUpdate(path, accessToken);
    if (ownershipRejection) {
      return ownershipRejection;
    }
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
    return buildRejectedTokenResponse(accessToken);
  }

  return proxyBackendResponse(response);
}
