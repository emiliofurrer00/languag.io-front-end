'use client';

import * as React from 'react';
import Link from 'next/link';
import { LoaderCircle, UserCheck, UserPlus, UserRoundSearch, UserRoundX } from 'lucide-react';

import { NeoButton } from '@/components/ui/NeoButton';
import { toast } from '@/hooks/useToast';
import { removeFriend, sendFriendRequest, getFriendshipStatus } from '@/lib/social/client';
import { getApiErrorMessage, useInvalidatedValueQuery } from '@/lib/social/hooks';
import { socialQueryKeys } from '@/lib/social/query-keys';
import { cn } from '@/lib/utils';
import { useInvalidateQueries } from '@/providers/QueryInvalidationProvider';

type ProfileFriendshipActionsProps = {
  otherUserId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const linkButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground px-4 py-2 text-sm font-semibold font-display shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]';

export function ProfileFriendshipActions({
  otherUserId,
  size = 'sm',
  className,
}: ProfileFriendshipActionsProps) {
  const invalidateQueries = useInvalidateQueries();
  const [isMutating, setIsMutating] = React.useState(false);
  const statusQuery = useInvalidatedValueQuery(
    socialQueryKeys.friendshipStatus(otherUserId),
    () => getFriendshipStatus(otherUserId),
    { enabled: Boolean(otherUserId) }
  );
  const friendshipStatus = statusQuery.data ?? 'None';

  async function handleSendRequest() {
    setIsMutating(true);

    try {
      await sendFriendRequest(otherUserId);
      invalidateQueries([
        socialQueryKeys.outgoingRequests,
        socialQueryKeys.friendshipStatus(otherUserId),
      ]);
      toast({
        title: 'Friend request sent',
        description: 'They will see it in their incoming requests.',
      });
    } catch (error) {
      invalidateQueries([
        socialQueryKeys.outgoingRequests,
        socialQueryKeys.incomingRequests,
        socialQueryKeys.friends,
        socialQueryKeys.friendshipStatus(otherUserId),
      ]);
      toast({
        title: 'Could not send request',
        description: getApiErrorMessage(error, 'Please try again in a moment.'),
        variant: 'destructive',
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRemoveFriend() {
    setIsMutating(true);

    try {
      await removeFriend(otherUserId);
      invalidateQueries([
        socialQueryKeys.friends,
        socialQueryKeys.friendshipStatus(otherUserId),
      ]);
      toast({
        title: 'Friend removed',
        description: 'You are no longer connected on Languag.io.',
      });
    } catch (error) {
      invalidateQueries([
        socialQueryKeys.friends,
        socialQueryKeys.friendshipStatus(otherUserId),
      ]);
      toast({
        title: 'Could not remove friend',
        description: getApiErrorMessage(error, 'Please try again in a moment.'),
        variant: 'destructive',
      });
    } finally {
      setIsMutating(false);
    }
  }

  if (statusQuery.isLoading) {
    return (
      <NeoButton variant="secondary" size={size} disabled className={cn('min-w-40', className)}>
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Checking status
      </NeoButton>
    );
  }

  if (statusQuery.errorMessage && !statusQuery.data) {
    return (
      <NeoButton variant="secondary" size={size} onClick={statusQuery.refetch} className={className}>
        <UserRoundSearch className="h-4 w-4" />
        Retry friendship check
      </NeoButton>
    );
  }

  if (friendshipStatus === 'Friends') {
    return (
      <NeoButton
        variant="secondary"
        size={size}
        disabled={isMutating}
        onClick={handleRemoveFriend}
        className={cn('min-w-40', className)}
      >
        {isMutating ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <UserRoundX className="h-4 w-4" />
        )}
        Remove Friend
      </NeoButton>
    );
  }

  if (friendshipStatus === 'IncomingPending') {
    return (
      <Link
        href="/friends?tab=incoming"
        className={cn(linkButtonClassName, 'min-w-40 bg-accent text-accent-foreground', className)}
      >
        <UserCheck className="h-4 w-4" />
        Review Request
      </Link>
    );
  }

  if (friendshipStatus === 'OutgoingPending') {
    return (
      <Link
        href="/friends?tab=outgoing"
        className={cn(
          linkButtonClassName,
          'min-w-40 bg-secondary text-secondary-foreground',
          className
        )}
      >
        <UserCheck className="h-4 w-4" />
        Request Sent
      </Link>
    );
  }

  return (
    <NeoButton
      variant="primary"
      size={size}
      disabled={isMutating || statusQuery.isRefreshing}
      onClick={handleSendRequest}
      className={cn('min-w-40', className)}
    >
      {isMutating || statusQuery.isRefreshing ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      Add Friend
    </NeoButton>
  );
}
