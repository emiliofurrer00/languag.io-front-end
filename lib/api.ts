import { getApiBaseUrl } from '@/lib/env';

type ApiFetchOptions = RequestInit & {
  accessToken?: string | null;
  useApiBaseUrl?: boolean;
};

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

async function readErrorMessage(response: Response) {
  try {
    const data = await response.json();
    return data?.message || data?.error || data?.detail || data?.title || response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function apiFetch<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const { accessToken, headers, useApiBaseUrl = true, ...rest } = init ?? {};
  const url = useApiBaseUrl ? buildApiUrl(path) : path;

  const response = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new ApiError(`API request failed for ${path}: ${message}`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
