'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, BellRing, CheckCheck, LoaderCircle, MailOpen, UserRound } from 'lucide-react';

import { SocialAvatar } from '@/components/social/SocialAvatar';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { toast } from '@/hooks/useToast';
import { buildProfilePath } from '@/lib/profile/paths';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/social/client';
import {
  getApiErrorMessage,
  useInvalidatedCursorQuery,
  useInvalidatedValueQuery,
} from '@/lib/social/hooks';
import { socialQueryKeys } from '@/lib/social/query-keys';
import type { NotificationItem } from '@/lib/social/types';
import { cn } from '@/lib/utils';
import { useInvalidateQueries } from '@/providers/QueryInvalidationProvider';

const linkButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground px-4 py-2 text-sm font-semibold font-display shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]';

function notificationActionHref(notification: NotificationItem) {
  if (notification.type === 'FriendRequestReceived') {
    return '/friends?tab=incoming';
  }

  const actorProfilePath = buildProfilePath(notification.actorUsername);
  if (actorProfilePath) {
    return actorProfilePath;
  }

  return '/friends';
}

function notificationActionLabel(notification: NotificationItem) {
  if (notification.type === 'FriendRequestReceived') {
    return 'Review request';
  }

  if (notification.actorUsername) {
    return 'View profile';
  }

  return 'Open friends';
}

function EmptyNotificationsState() {
  return (
    <NeoCard className="p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-foreground bg-secondary shadow-[4px_4px_0_0_hsl(var(--foreground))]">
        <Bell className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-xl font-bold">No notifications yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Friend requests and acceptance updates will show up here as soon as they happen.
      </p>
    </NeoCard>
  );
}

function NotificationCard({
  notification,
  isBusy,
  onMarkRead,
}: {
  notification: NotificationItem;
  isBusy: boolean;
  onMarkRead: () => Promise<void>;
}) {
  return (
    <NeoCard
      className={cn('p-5 transition-colors', notification.isRead ? 'bg-card' : 'bg-neo-yellow/30')}
    >
      <div
        className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        onClick={() => {
          if (!notification.isRead) {
            void onMarkRead();
          }
        }}
      >
        <div className="flex items-start gap-4">
          <SocialAvatar label={notification.actorDisplayName ?? notification.title} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-lg font-bold">
                {notification.title || 'New notification'}
              </p>
              {!notification.isRead ? (
                <span className="rounded-full border border-foreground bg-neo-coral px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  Unread
                </span>
              ) : null}
            </div>
            {notification.body ? (
              <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
            ) : null}
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {notification.createdAtLabel}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={notificationActionHref(notification)}
            className={cn(linkButtonClassName, 'bg-accent text-accent-foreground')}
          >
            {notification.type === 'FriendRequestReceived' ? (
              <MailOpen className="h-4 w-4" />
            ) : (
              <UserRound className="h-4 w-4" />
            )}
            {notificationActionLabel(notification)}
          </Link>
          {!notification.isRead ? (
            <NeoButton
              variant="secondary"
              size="sm"
              disabled={isBusy}
              onClick={() => void onMarkRead()}
            >
              {isBusy ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              Mark Read
            </NeoButton>
          ) : null}
        </div>
      </div>
    </NeoCard>
  );
}

export function NotificationsPageClient() {
  const invalidateQueries = useInvalidateQueries();
  const [pendingNotificationId, setPendingNotificationId] = React.useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = React.useState(false);
  const notificationsQuery = useInvalidatedCursorQuery(
    socialQueryKeys.notifications,
    getNotifications
  );
  const unreadCountQuery = useInvalidatedValueQuery(
    socialQueryKeys.unreadNotificationCount,
    getUnreadNotificationCount,
    { pollMs: 45000 }
  );
  const unreadCount = unreadCountQuery.data?.count ?? 0;

  async function handleMarkRead(notificationId: string) {
    setPendingNotificationId(notificationId);

    try {
      await markNotificationRead(notificationId);
      invalidateQueries([socialQueryKeys.notifications, socialQueryKeys.unreadNotificationCount]);
    } catch (error) {
      invalidateQueries([socialQueryKeys.notifications, socialQueryKeys.unreadNotificationCount]);
      toast({
        title: 'Could not mark notification as read',
        description: getApiErrorMessage(error, 'Please try again in a moment.'),
        variant: 'destructive',
      });
    } finally {
      setPendingNotificationId(null);
    }
  }

  async function handleMarkAllRead() {
    setIsMarkingAll(true);

    try {
      const result = await markAllNotificationsRead();
      invalidateQueries([socialQueryKeys.notifications, socialQueryKeys.unreadNotificationCount]);
      toast({
        title: 'Notifications updated',
        description:
          result.updatedCount > 0
            ? `${result.updatedCount} notification${result.updatedCount === 1 ? '' : 's'} marked as read.`
            : 'Everything was already up to date.',
      });
    } catch (error) {
      invalidateQueries([socialQueryKeys.notifications, socialQueryKeys.unreadNotificationCount]);
      toast({
        title: 'Could not mark all notifications as read',
        description: getApiErrorMessage(error, 'Please try again in a moment.'),
        variant: 'destructive',
      });
    } finally {
      setIsMarkingAll(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-secondary px-4 py-2 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
            <BellRing className="h-4 w-4" />
            <span className="text-sm font-semibold">
              {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Friend requests and friendship updates land here first. The unread count refreshes
            automatically.
          </p>
        </div>
        <NeoButton
          variant="secondary"
          onClick={handleMarkAllRead}
          disabled={isMarkingAll || unreadCount === 0}
        >
          {isMarkingAll ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCheck className="h-4 w-4" />
          )}
          Mark All Read
        </NeoButton>
      </div>

      {notificationsQuery.isRefreshing ? (
        <p className="mt-4 text-sm text-muted-foreground">Refreshing notifications…</p>
      ) : null}

      {notificationsQuery.isLoading ? (
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((index) => (
            <NeoCard key={index} className="animate-pulse p-5">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-2xl bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded-full bg-secondary" />
                  <div className="h-3 w-full rounded-full bg-secondary" />
                  <div className="h-3 w-28 rounded-full bg-secondary" />
                </div>
              </div>
            </NeoCard>
          ))}
        </div>
      ) : null}

      {!notificationsQuery.isLoading && notificationsQuery.errorMessage ? (
        <NeoCard className="mt-8 p-6">
          <p className="font-semibold">We could not load your notifications.</p>
          <p className="mt-2 text-sm text-muted-foreground">{notificationsQuery.errorMessage}</p>
          <NeoButton
            variant="secondary"
            size="sm"
            onClick={notificationsQuery.refetch}
            className="mt-4"
          >
            Try Again
          </NeoButton>
        </NeoCard>
      ) : null}

      {!notificationsQuery.isLoading &&
      !notificationsQuery.errorMessage &&
      notificationsQuery.items.length === 0 ? (
        <div className="mt-8">
          <EmptyNotificationsState />
        </div>
      ) : null}

      {!notificationsQuery.isLoading &&
      !notificationsQuery.errorMessage &&
      notificationsQuery.items.length > 0 ? (
        <div className="mt-8 space-y-4">
          {notificationsQuery.items.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isBusy={pendingNotificationId === notification.id}
              onMarkRead={() => handleMarkRead(notification.id)}
            />
          ))}
        </div>
      ) : null}

      {!notificationsQuery.isLoading && notificationsQuery.nextCursor ? (
        <div className="mt-8 flex justify-center">
          <NeoButton
            variant="secondary"
            onClick={() => void notificationsQuery.loadMore()}
            disabled={notificationsQuery.isLoadingMore}
          >
            {notificationsQuery.isLoadingMore ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : null}
            Load More
          </NeoButton>
        </div>
      ) : null}
    </div>
  );
}
