import { NextResponse } from 'next/server';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function rejectCrossOriginMutation(request: Request) {
  if (!MUTATING_METHODS.has(request.method.toUpperCase())) {
    return null;
  }

  const requestOrigin = new URL(request.url).origin;
  const allowedOrigins = getAllowedOrigins(requestOrigin);
  const origin = normalizeOrigin(request.headers.get('origin'));

  if (origin && !allowedOrigins.has(origin)) {
    return NextResponse.json({ message: 'Cross-origin requests are not allowed.' }, { status: 403 });
  }

  const fetchSite = request.headers.get('sec-fetch-site')?.toLowerCase();
  if (!origin && (!fetchSite || !['same-origin', 'same-site', 'none'].includes(fetchSite))) {
    return NextResponse.json({ message: 'Cross-origin requests are not allowed.' }, { status: 403 });
  }

  return null;
}

function getAllowedOrigins(requestOrigin: string) {
  const origins = [
    requestOrigin,
    process.env.KINDE_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_ORIGIN,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    ...readCsv(process.env.CSRF_TRUSTED_ORIGINS),
  ];

  return new Set(
    origins
      .map(normalizeOrigin)
      .filter((origin): origin is string => origin !== null)
  );
}

function readCsv(value: string | undefined) {
  return value?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];
}

function normalizeOrigin(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}
