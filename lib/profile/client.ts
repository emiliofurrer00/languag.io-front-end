import { apiFetch } from '@/lib/api';
import type { ProfileAccentColor } from '@/lib/profile/types';

type CreateProfilePictureUploadResponse = {
  uploadUrl: string;
  fields: Record<string, string>;
  objectKey: string;
  publicUrl?: string | null;
  expiresAtUtc: string;
  maxBytes: number;
};

export type UpdateMyProfileInput = {
  username: string;
  name: string;
  hasBeenOnboarded: boolean;
  dailyCardsGoal: number;
  profileDescription: string;
  about: string;
  isPublicProfile: boolean;
  avatarColor: ProfileAccentColor;
};

type ApiErrorPayload = {
  message?: string;
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
} | null;

function readApiErrorMessage(payload: ApiErrorPayload, fallback: string) {
  if (!payload) {
    return fallback;
  }

  const validationMessage = payload.errors
    ? Object.values(payload.errors)
        .flat()
        .find((message) => typeof message === 'string' && message.trim())
    : undefined;

  return payload.message || payload.detail || validationMessage || payload.title || fallback;
}

export async function updateMyProfile(profile: UpdateMyProfileInput) {
  const response = await fetch('/api/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  const payload = (await response.json().catch(() => null)) as ApiErrorPayload | unknown;

  if (!response.ok) {
    throw new Error(
      readApiErrorMessage(payload as ApiErrorPayload, 'Unable to update your profile.')
    );
  }

  return payload;
}

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
