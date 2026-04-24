import { apiFetch } from '@/lib/api';
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
