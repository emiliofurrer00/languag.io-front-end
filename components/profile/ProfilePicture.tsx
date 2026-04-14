import type { ProfileAccentColor } from '@/lib/profile/types';
import NeoBox from '../ui/NeoBox';

export default function ProfilePicture({
  initials,
  color,
  className,
}: {
  initials: string;
  color: ProfileAccentColor;
  className?: string;
}) {
  return (
    <NeoBox className={`bg-neo-${color} ${className}`}>
      <span className="text-3xl font-bold">{initials}</span>
    </NeoBox>
  );
}
