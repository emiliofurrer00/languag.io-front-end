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
};

const linkButtonClassName =
  'inline-flex min-w-40 items-center justify-center gap-2 rounded-full border-[2px] border-foreground px-4 py-2 text-sm font-semibold font-display shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]';

export function ProfileFriendshipActions({ otherUserId }: ProfileFriendshipActionsProps) {
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
      <NeoButton variant="secondary" size="sm" disabled className="min-w-40">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Checking status
      </NeoButton>
    );
  }

  if (statusQuery.errorMessage && !statusQuery.data) {
    return (
      <NeoButton variant="secondary" size="sm" onClick={statusQuery.refetch}>
        <UserRoundSearch className="h-4 w-4" />
        Retry friendship check
      </NeoButton>
    );
  }

  if (friendshipStatus === 'Friends') {
    return (
      <NeoButton
        variant="secondary"
        size="sm"
        disabled={isMutating}
        onClick={handleRemoveFriend}
        className="min-w-40"
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
        className={cn(linkButtonClassName, 'bg-accent text-accent-foreground')}
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
        className={cn(linkButtonClassName, 'bg-secondary text-secondary-foreground')}
      >
        <UserCheck className="h-4 w-4" />
        Request Sent
      </Link>
    );
  }

  return (
    <NeoButton
      variant="primary"
      size="sm"
      disabled={isMutating || statusQuery.isRefreshing}
      onClick={handleSendRequest}
      className="min-w-40"
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
