import { buildApiUrl } from '@/lib/api';
import { getMissingAudienceMessage, getRequiredApiAccessToken } from '@/lib/kinde-server';
import { NextRequest, NextResponse } from 'next/server';

function normalizeAvailabilityResponse(payload: unknown) {
  if (typeof payload === 'boolean') {
    return {
      available: payload,
    };
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      available: false,
    };
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.available === 'boolean') {
    return {
      available: record.available,
    };
  }

  if (typeof record.isAvailable === 'boolean') {
    return {
      available: record.isAvailable,
    };
  }

  if (typeof record.taken === 'boolean') {
    return {
      available: !record.taken,
    };
  }

  return {
    available: false,
  };
}

function parseAvailabilityPayload(text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed === 'true' || trimmed === 'false') {
    return trimmed === 'true';
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

function readAvailabilityErrorMessage(text: string) {
  const payload = parseAvailabilityPayload(text);

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return text.trim() || 'Unable to check username availability.';
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.message === 'string' && record.message.trim()) {
    return record.message.trim();
  }

  return text.trim() || 'Unable to check username availability.';
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')?.trim() ?? '';

  if (!username) {
    return NextResponse.json(
      { message: 'Username is required.' },
      {
        status: 400,
      }
    );
  }

  let accessToken: string;

  try {
    accessToken = await getRequiredApiAccessToken();
  } catch {
    return NextResponse.json({ message: getMissingAudienceMessage() }, { status: 401 });
  }

  const response = await fetch(
    buildApiUrl(`/Users/username-availability?username=${encodeURIComponent(username)}`),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const message = readAvailabilityErrorMessage(await response.text());

    return NextResponse.json(
      {
        message,
      },
      {
        status: response.status,
      }
    );
  }

  const payload = parseAvailabilityPayload(await response.text());

  return NextResponse.json(normalizeAvailabilityResponse(payload));
}
