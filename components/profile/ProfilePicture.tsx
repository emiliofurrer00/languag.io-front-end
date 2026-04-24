import type { ProfileAccentColor } from '@/lib/profile/types';
import { getNeoColorClass } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import NeoBox from '../ui/NeoBox';

export default function ProfilePicture({
  initials,
  color,
  imageUrl,
  className,
}: {
  initials: string;
  color: ProfileAccentColor;
  imageUrl?: string;
  className?: string;
}) {
  const isLocalPreview =
    imageUrl?.startsWith('blob:') === true || imageUrl?.startsWith('data:') === true;

  return (
    <NeoBox
      padding={imageUrl ? 'p-0' : 'p-8'}
      className={cn(
        imageUrl ? 'relative h-32 w-32 overflow-hidden' : getNeoColorClass(color),
        className
      )}
    >
      {imageUrl && isLocalPreview ? (
        // Local previews cannot go through the Next image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Profile picture" className="h-full w-full object-cover" />
      ) : imageUrl ? (
        <Image src={imageUrl} alt="Profile picture" fill sizes="128px" className="object-cover" />
      ) : (
        <span className="text-3xl font-bold">{initials}</span>
      )}
    </NeoBox>
  );
}
