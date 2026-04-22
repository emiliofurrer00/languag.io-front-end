import { cn } from '@/lib/utils';
import { getDisplayInitials } from '@/lib/social/types';

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
  className?: string;
};

export function SocialAvatar({ label, className }: SocialAvatarProps) {
  return (
    <div
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-foreground text-xs font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))]',
        getAvatarColor(label ?? ''),
        className
      )}
      aria-hidden="true"
    >
      {getDisplayInitials(label)}
    </div>
  );
}
