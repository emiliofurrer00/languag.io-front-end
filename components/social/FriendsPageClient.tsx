'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowRight,
  Check,
  LoaderCircle,
  MailOpen,
  Trash2,
  UserCheck,
  UserPlus,
  UserRoundMinus,
  X,
} from 'lucide-react';

import { SocialAvatar } from '@/components/social/SocialAvatar';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { toast } from '@/hooks/useToast';
import { buildProfilePath } from '@/lib/profile/paths';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriends,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  rejectFriendRequest,
  removeFriend,
} from '@/lib/social/client';
import { getApiErrorMessage, useInvalidatedCursorQuery } from '@/lib/social/hooks';
import { socialQueryKeys } from '@/lib/social/query-keys';
import type { FriendRequest, FriendSummary } from '@/lib/social/types';
import { cn } from '@/lib/utils';
import { useInvalidateQueries } from '@/providers/QueryInvalidationProvider';

type FriendsTab = 'friends' | 'incoming' | 'outgoing';

type FriendsPageClientProps = {
  initialTab?: FriendsTab;
};

const tabs: Array<{ id: FriendsTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'friends', label: 'Friends', icon: UserCheck },
  { id: 'incoming', label: 'Incoming', icon: MailOpen },
  { id: 'outgoing', label: 'Outgoing', icon: UserPlus },
];

const linkButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground px-4 py-2 text-sm font-semibold font-display shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]';

function LoadingState() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((index) => (
        <NeoCard key={index} className="animate-pulse p-5">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded-full bg-secondary" />
              <div className="h-3 w-48 rounded-full bg-secondary" />
            </div>
          </div>
        </NeoCard>
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <NeoCard className="p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-foreground bg-secondary shadow-[4px_4px_0_0_hsl(var(--foreground))]">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </NeoCard>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <NeoCard className="p-6">
      <p className="font-semibold">We hit a snag loading this list.</p>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <NeoButton variant="secondary" size="sm" onClick={onRetry} className="mt-4">
        Try Again
      </NeoButton>
    </NeoCard>
  );
}

export function FriendsPageClient({ initialTab = 'friends' }: FriendsPageClientProps) {
  const invalidateQueries = useInvalidateQueries();
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<FriendsTab>(initialTab);
  const [pendingActionId, setPendingActionId] = React.useState<string | null>(null);
  const [isNavigating, startTransition] = React.useTransition();

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const friendsQuery = useInvalidatedCursorQuery(socialQueryKeys.friends, getFriends, {
    enabled: activeTab === 'friends',
  });
  const incomingQuery = useInvalidatedCursorQuery(
    socialQueryKeys.incomingRequests,
    getIncomingFriendRequests,
    { enabled: activeTab === 'incoming' }
  );
  const outgoingQuery = useInvalidatedCursorQuery(
    socialQueryKeys.outgoingRequests,
    getOutgoingFriendRequests,
    { enabled: activeTab === 'outgoing' }
  );

  const activeQuery =
    activeTab === 'friends'
      ? friendsQuery
      : activeTab === 'incoming'
        ? incomingQuery
        : outgoingQuery;

  const isBusy = (id: string) => pendingActionId === id;

  function handleTabChange(nextTab: FriendsTab) {
    setActiveTab(nextTab);
    startTransition(() => {
      router.replace(`${pathname}?tab=${nextTab}`, { scroll: false });
    });
  }

  async function runMutation({
    actionId,
    action,
    onSuccess,
    successTitle,
    successDescription,
    failureTitle,
  }: {
    actionId: string;
    action: () => Promise<void>;
    onSuccess: () => void;
    successTitle: string;
    successDescription: string;
    failureTitle: string;
  }) {
    setPendingActionId(actionId);

    try {
      await action();
      onSuccess();
      toast({
        title: successTitle,
        description: successDescription,
      });
    } catch (error) {
      onSuccess();
      toast({
        title: failureTitle,
        description: getApiErrorMessage(error, 'Please try again in a moment.'),
        variant: 'destructive',
      });
    } finally {
      setPendingActionId(null);
    }
  }

  function renderIncomingRequest(request: FriendRequest) {
    const actionIdPrefix = `incoming:${request.id}`;
    const senderProfilePath = buildProfilePath(request.senderUsername);

    return (
      <NeoCard key={request.id} className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <SocialAvatar label={request.senderDisplayName} />
            <div>
              {senderProfilePath ? (
                <Link
                  href={senderProfilePath}
                  className="font-display text-lg font-bold hover:underline"
                >
                  {request.senderDisplayName}
                </Link>
              ) : (
                <p className="font-display text-lg font-bold">{request.senderDisplayName}</p>
              )}
              <p className="text-sm text-muted-foreground">Sent {request.createdAtLabel}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <NeoButton
              variant="success"
              size="sm"
              disabled={isBusy(`${actionIdPrefix}:accept`)}
              onClick={() =>
                runMutation({
                  actionId: `${actionIdPrefix}:accept`,
                  action: () => acceptFriendRequest(request.id),
                  onSuccess: () =>
                    invalidateQueries([
                      socialQueryKeys.incomingRequests,
                      socialQueryKeys.friends,
                      socialQueryKeys.friendshipStatus(request.senderId),
                    ]),
                  successTitle: 'Friend request accepted',
                  successDescription: `${request.senderDisplayName} is now in your friends list.`,
                  failureTitle: 'Could not accept request',
                })
              }
            >
              {isBusy(`${actionIdPrefix}:accept`) ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Accept
            </NeoButton>
            <NeoButton
              variant="secondary"
              size="sm"
              disabled={isBusy(`${actionIdPrefix}:reject`)}
              onClick={() =>
                runMutation({
                  actionId: `${actionIdPrefix}:reject`,
                  action: () => rejectFriendRequest(request.id),
                  onSuccess: () =>
                    invalidateQueries([
                      socialQueryKeys.incomingRequests,
                      socialQueryKeys.friendshipStatus(request.senderId),
                    ]),
                  successTitle: 'Friend request rejected',
                  successDescription: 'The request has been cleared from your inbox.',
                  failureTitle: 'Could not reject request',
                })
              }
            >
              {isBusy(`${actionIdPrefix}:reject`) ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Reject
            </NeoButton>
          </div>
        </div>
      </NeoCard>
    );
  }

  function renderOutgoingRequest(request: FriendRequest) {
    const actionId = `outgoing:${request.id}`;
    const receiverProfilePath = buildProfilePath(request.receiverUsername);

    return (
      <NeoCard key={request.id} className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <SocialAvatar label={request.receiverDisplayName} />
            <div>
              {receiverProfilePath ? (
                <Link
                  href={receiverProfilePath}
                  className="font-display text-lg font-bold hover:underline"
                >
                  {request.receiverDisplayName}
                </Link>
              ) : (
                <p className="font-display text-lg font-bold">{request.receiverDisplayName}</p>
              )}
              <p className="text-sm text-muted-foreground">Sent {request.createdAtLabel}</p>
            </div>
          </div>
          <NeoButton
            variant="secondary"
            size="sm"
            disabled={isBusy(actionId)}
            onClick={() =>
              runMutation({
                actionId,
                action: () => cancelFriendRequest(request.id),
                onSuccess: () =>
                  invalidateQueries([
                    socialQueryKeys.outgoingRequests,
                    socialQueryKeys.friendshipStatus(request.receiverId),
                  ]),
                successTitle: 'Friend request cancelled',
                successDescription: 'The pending request has been removed.',
                failureTitle: 'Could not cancel request',
              })
            }
          >
            {isBusy(actionId) ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Cancel Request
          </NeoButton>
        </div>
      </NeoCard>
    );
  }

  function renderFriend(friend: FriendSummary) {
    const actionId = `friend:${friend.userId}`;
    const profilePath = buildProfilePath(friend.username);

    return (
      <NeoCard key={friend.userId} className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <SocialAvatar label={friend.displayName} />
            <div>
              {profilePath ? (
                <Link
                  href={profilePath}
                  className="font-display text-lg font-bold hover:underline"
                >
                  {friend.displayName}
                </Link>
              ) : (
                <p className="font-display text-lg font-bold">{friend.displayName}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Friends since {friend.friendsSinceLabel}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {profilePath ? (
              <Link
                href={profilePath}
                className={cn(linkButtonClassName, 'bg-accent text-accent-foreground')}
              >
                <ArrowRight className="h-4 w-4" />
                View Profile
              </Link>
            ) : null}
            <NeoButton
              variant="secondary"
              size="sm"
              disabled={isBusy(actionId)}
              onClick={() =>
                runMutation({
                  actionId,
                  action: () => removeFriend(friend.userId),
                  onSuccess: () =>
                    invalidateQueries([
                      socialQueryKeys.friends,
                      socialQueryKeys.friendshipStatus(friend.userId),
                    ]),
                  successTitle: 'Friend removed',
                  successDescription: `${friend.displayName} has been removed from your friends list.`,
                  failureTitle: 'Could not remove friend',
                })
              }
            >
              {isBusy(actionId) ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <UserRoundMinus className="h-4 w-4" />
              )}
              Remove
            </NeoButton>
          </div>
        </div>
      </NeoCard>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Friends</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your current friends and every pending request from one place.
          </p>
        </div>
        <div className="rounded-full border-2 border-foreground bg-secondary p-1 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          <div className="flex flex-wrap gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab === id ? 'bg-primary text-primary-foreground' : 'text-foreground'
                )}
                onClick={() => handleTabChange(id)}
                disabled={isNavigating}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeQuery.isRefreshing ? (
        <p className="mt-4 text-sm text-muted-foreground">Refreshing results…</p>
      ) : null}

      <div className="mt-8 space-y-4">
        {activeQuery.isLoading ? <LoadingState /> : null}

        {!activeQuery.isLoading && activeQuery.errorMessage ? (
          <ErrorState message={activeQuery.errorMessage} onRetry={activeQuery.refetch} />
        ) : null}

        {!activeQuery.isLoading &&
        !activeQuery.errorMessage &&
        activeTab === 'friends' &&
        friendsQuery.items.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No friends yet"
            description="Once you connect with someone, they will show up here with a quick link back to their profile."
          />
        ) : null}

        {!activeQuery.isLoading &&
        !activeQuery.errorMessage &&
        activeTab === 'incoming' &&
        incomingQuery.items.length === 0 ? (
          <EmptyState
            icon={MailOpen}
            title="No incoming requests"
            description="When someone sends you a friend request, you will be able to accept or reject it here."
          />
        ) : null}

        {!activeQuery.isLoading &&
        !activeQuery.errorMessage &&
        activeTab === 'outgoing' &&
        outgoingQuery.items.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No outgoing requests"
            description="Requests you send from profile pages will appear here until they are accepted, rejected, or cancelled."
          />
        ) : null}

        {!activeQuery.isLoading &&
        !activeQuery.errorMessage &&
        activeTab === 'friends'
          ? friendsQuery.items.map(renderFriend)
          : null}

        {!activeQuery.isLoading &&
        !activeQuery.errorMessage &&
        activeTab === 'incoming'
          ? incomingQuery.items.map(renderIncomingRequest)
          : null}

        {!activeQuery.isLoading &&
        !activeQuery.errorMessage &&
        activeTab === 'outgoing'
          ? outgoingQuery.items.map(renderOutgoingRequest)
          : null}
      </div>

      {!activeQuery.isLoading && activeQuery.nextCursor ? (
        <div className="mt-8 flex justify-center">
          <NeoButton
            variant="secondary"
            onClick={() => void activeQuery.loadMore()}
            disabled={activeQuery.isLoadingMore}
          >
            {activeQuery.isLoadingMore ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : null}
            Load More
          </NeoButton>
        </div>
      ) : null}
    </div>
  );
}
