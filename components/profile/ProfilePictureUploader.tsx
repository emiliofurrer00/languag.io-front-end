'use client';

import * as React from 'react';
import { Camera, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import ProfilePicture from '@/components/profile/ProfilePicture';
import { NeoButton } from '@/components/ui/NeoButton';
import { toast } from '@/hooks/useToast';
import {
  completeProfilePictureUpload,
  createProfilePictureUpload,
  uploadProfilePictureToS3,
} from '@/lib/profile/client';
import { profileQueryKeys } from '@/lib/profile/query-keys';
import type { ProfileData } from '@/lib/profile/types';
import { useInvalidateQueries } from '@/providers/QueryInvalidationProvider';

const TARGET_IMAGE_SIZE = 256;
const MAX_SOURCE_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_COMPRESSED_IMAGE_BYTES = 512 * 1024;
const WEBP_QUALITIES = [0.86, 0.78, 0.7, 0.62];

type LoadedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not compress this image.'));
          return;
        }

        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
}

async function loadImage(file: File): Promise<LoadedImage> {
  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file);

    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
    };
  }

  const objectUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        close: () => URL.revokeObjectURL(objectUrl),
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read this image.'));
    };
    image.src = objectUrl;
  });
}

async function compressProfilePicture(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose a PNG, JPG, or WebP image.');
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error('Choose an image smaller than 8 MB.');
  }

  const image = await loadImage(file);

  try {
    const canvas = document.createElement('canvas');
    canvas.width = TARGET_IMAGE_SIZE;
    canvas.height = TARGET_IMAGE_SIZE;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Your browser could not prepare this image.');
    }

    const scale = Math.max(TARGET_IMAGE_SIZE / image.width, TARGET_IMAGE_SIZE / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const drawX = (TARGET_IMAGE_SIZE - drawWidth) / 2;
    const drawY = (TARGET_IMAGE_SIZE - drawHeight) / 2;

    context.clearRect(0, 0, TARGET_IMAGE_SIZE, TARGET_IMAGE_SIZE);
    context.drawImage(image.source, drawX, drawY, drawWidth, drawHeight);

    let smallestBlob: Blob | null = null;

    for (const quality of WEBP_QUALITIES) {
      const blob = await canvasToBlob(canvas, quality);
      smallestBlob = blob;

      if (blob.size <= MAX_COMPRESSED_IMAGE_BYTES) {
        return blob;
      }
    }

    if (smallestBlob && smallestBlob.size <= MAX_COMPRESSED_IMAGE_BYTES) {
      return smallestBlob;
    }

    throw new Error('The compressed image is still too large. Try a simpler image.');
  } finally {
    image.close();
  }
}

function readErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Could not update your profile picture.';
}

export function ProfilePictureUploader({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const compressedImage = await compressProfilePicture(file);
      const uploadTarget = await createProfilePictureUpload({
        contentLength: compressedImage.size,
      });

      await uploadProfilePictureToS3({
        uploadUrl: uploadTarget.uploadUrl,
        fields: uploadTarget.fields,
        image: compressedImage,
      });
      await completeProfilePictureUpload(uploadTarget.objectKey);

      const nextPreviewUrl = URL.createObjectURL(compressedImage);
      setPreviewUrl((currentPreviewUrl) => {
        if (currentPreviewUrl) {
          URL.revokeObjectURL(currentPreviewUrl);
        }

        return nextPreviewUrl;
      });

      toast({
        title: 'Profile picture updated',
        description: 'Your new picture is live on your profile.',
      });
      invalidateQueries([profileQueryKeys.me]);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Could not update picture',
        description: readErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 md:items-start">
      <div className="relative">
        <ProfilePicture
          initials={profile.initials}
          color={profile.avatarColor}
          imageUrl={previewUrl ?? profile.profilePictureUrl}
        />
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl border-[3px] border-foreground bg-background/70">
            <LoaderCircle className="h-7 w-7 animate-spin" />
          </div>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          void handleFileChange(event);
        }}
      />

      <NeoButton
        type="button"
        size="sm"
        variant="secondary"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        {isUploading
          ? 'Uploading...'
          : profile.profilePictureUrl
            ? 'Change Picture'
            : 'Add Picture'}
      </NeoButton>
    </div>
  );
}
