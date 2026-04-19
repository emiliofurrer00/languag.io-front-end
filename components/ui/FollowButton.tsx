'use client';

import { useState } from 'react';
import { NeoButton } from '@/components/ui/NeoButton';
import { Check, UserPlus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  /** Whether this user already follows you (drives the "Follow back" label) */
  followsYou?: boolean;
  /** Initial follow state */
  initialFollowing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onChange?: (following: boolean) => void;
}

export default function FollowButton({
  followsYou = false,
  initialFollowing = false,
  size = 'sm',
  className,
  onChange,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [hover, setHover] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !following;
    setFollowing(next);
    onChange?.(next);
  };

  if (following) {
    return (
      <NeoButton
        variant={hover ? 'outline' : 'success'}
        size={size}
        onClick={toggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cn('min-w-[110px]', className)}
      >
        {hover ? (
          <>Unfollow</>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Following
          </>
        )}
      </NeoButton>
    );
  }

  return (
    <NeoButton
      variant="primary"
      size={size}
      onClick={toggle}
      className={cn('min-w-[110px]', className)}
    >
      {followsYou ? (
        <>
          <Users className="w-4 h-4" />
          Follow back
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </NeoButton>
  );
}
