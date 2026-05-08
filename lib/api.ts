import { getApiBaseUrl } from '@/lib/env';

type ApiFetchOptions = RequestInit & {
  accessToken?: string | null;
  useApiBaseUrl?: boolean;
};

export const API_UNAVAILABLE_MESSAGE =
  'The learning backend is temporarily unavailable. Try again in a moment.';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = getApiBaseUrl();
  const safeBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return new URL(normalizedPath, safeBaseUrl).toString();
}

function stripApiRequestPrefix(message: string) {
  return message.replace(/^API request failed for [^:]+:\s*/, '').trim();
}

function isUnavailableMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes('fetch failed') ||
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('load failed') ||
    normalizedMessage.includes('networkerror') ||
    normalizedMessage.includes('network request failed')
  );
}

export function getApiErrorDisplayMessage(
  error: unknown,
  fallbackMessage = API_UNAVAILABLE_MESSAGE
) {
  if (error instanceof ApiError) {
    const message = stripApiRequestPrefix(error.message);

    return message || fallbackMessage;
  }

  if (error instanceof Error && error.message.trim()) {
    const message = stripApiRequestPrefix(error.message);

    return isUnavailableMessage(message) ? API_UNAVAILABLE_MESSAGE : message;
  }

  return fallbackMessage;
}

async function readErrorMessage(response: Response) {
  try {
    const data = await response.json();
    const message =
      data?.message || data?.error || data?.detail || data?.title || response.statusText;
    const nextAllowedAtUtc = data?.nextAllowedAtUtc;

    if (typeof nextAllowedAtUtc === 'string') {
      const nextAllowedAt = new Date(nextAllowedAtUtc);
      if (!Number.isNaN(nextAllowedAt.getTime())) {
        return `${message} Try again after ${nextAllowedAt.toLocaleString()}.`;
      }
    }

    return message;
  } catch {
    return response.statusText;
  }
}

export async function apiFetch<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const { accessToken, headers, useApiBaseUrl = true, ...rest } = init ?? {};
  const url = useApiBaseUrl ? buildApiUrl(path) : path;

  let response: Response;

  try {
    response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(`API request failed for ${path}: ${API_UNAVAILABLE_MESSAGE}`, 503);
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new ApiError(`API request failed for ${path}: ${message}`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
