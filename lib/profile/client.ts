import { apiFetch } from '@/lib/api';
import type { ProfileData } from '@/lib/profile/types';

export type CurrentProfileSummary = Pick<
  ProfileData,
  'email' | 'handle' | 'name' | 'profilePictureUrl' | 'username'
>;

type ApiUserMeResponse = {
  username?: string | null;
  name?: string | null;
  email?: string | null;
  profilePictureUrl?: string | null;
};

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizeCurrentProfileSummary(response: ApiUserMeResponse): CurrentProfileSummary {
  const email = readString(response.email);
  const username = readString(response.username);
  const emailLocalPart = email?.split('@')[0];
  const name = readString(response.name) || username || emailLocalPart || 'User';

  return {
    email,
    handle: username || emailLocalPart,
    name,
    profilePictureUrl: readString(response.profilePictureUrl),
    username,
  };
}

export async function getCurrentProfileSummary() {
  const response = await apiFetch<ApiUserMeResponse>('/api/users/me', {
    cache: 'no-store',
    useApiBaseUrl: false,
  });

  return normalizeCurrentProfileSummary(response);
}

type CreateProfilePictureUploadResponse = {
  uploadUrl: string;
  fields: Record<string, string>;
  objectKey: string;
  publicUrl?: string | null;
  expiresAtUtc: string;
  maxBytes: number;
};

export async function createProfilePictureUpload({ contentLength }: { contentLength: number }) {
  return apiFetch<CreateProfilePictureUploadResponse>(
    '/api/users/me/profile-picture/upload-request',
    {
      method: 'POST',
      body: JSON.stringify({
        contentType: 'image/webp',
        contentLength,
      }),
      useApiBaseUrl: false,
    }
  );
}

export async function uploadProfilePictureToS3({
  uploadUrl,
  fields,
  image,
}: {
  uploadUrl: string;
  fields: Record<string, string>;
  image: Blob;
}) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  formData.append('file', image, 'profile-picture.webp');

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('The profile picture upload failed before it reached your profile.');
  }
}

export async function completeProfilePictureUpload(objectKey: string) {
  return apiFetch<unknown>('/api/users/me/profile-picture/complete', {
    method: 'POST',
    body: JSON.stringify({ objectKey }),
    useApiBaseUrl: false,
  });
}
