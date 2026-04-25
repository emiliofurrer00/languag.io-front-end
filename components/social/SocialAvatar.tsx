'use client';

import { cn } from '@/lib/utils';
import { getDisplayInitials } from '@/lib/social/types';
import Image from 'next/image';
import { useState } from 'react';

const avatarColorClasses = [
  'bg-neo-yellow',
  'bg-neo-teal',
  'bg-neo-magenta',
  'bg-neo-blue',
  'bg-neo-coral',
];

function getAvatarColor(seed: string) {
  const normalizedSeed = seed.trim();

  if (!normalizedSeed) {
    return avatarColorClasses[0];
  }

  let score = 0;
  for (const character of normalizedSeed) {
    score += character.charCodeAt(0);
  }

  return avatarColorClasses[score % avatarColorClasses.length];
}

type SocialAvatarProps = {
  label?: string | null;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
  sizes?: string;
};

export function SocialAvatar({
  label,
  imageUrl,
  className,
  fallbackClassName,
  sizes = '44px',
}: SocialAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const shouldShowImage = Boolean(imageUrl) && failedImageUrl !== imageUrl;

  return (
    <div
      className={cn(
        'relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-foreground text-xs font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))]',
        shouldShowImage ? 'bg-secondary' : getAvatarColor(label ?? ''),
        !shouldShowImage ? fallbackClassName : null,
        className
      )}
      aria-hidden="true"
    >
      {shouldShowImage ? (
        <Image
          src={imageUrl!}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          unoptimized
          onError={() => setFailedImageUrl(imageUrl ?? null)}
        />
      ) : (
        getDisplayInitials(label)
      )}
    </div>
  );
}
