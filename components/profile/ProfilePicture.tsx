import type { ProfileAccentColor } from '@/lib/profile/types';
import { getNeoColorClass } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';
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
    <NeoBox className={cn(getNeoColorClass(color), className)}>
      <span className="text-3xl font-bold">{initials}</span>
    </NeoBox>
  );
}
