import { API_UNAVAILABLE_MESSAGE } from '@/lib/api';
import { NextResponse } from 'next/server';

export function buildBackendUnavailableResponse(error: unknown) {
  console.warn('Backend API request failed.', error);

  return NextResponse.json(
    {
      message: API_UNAVAILABLE_MESSAGE,
    },
    {
      status: 503,
    }
  );
}
