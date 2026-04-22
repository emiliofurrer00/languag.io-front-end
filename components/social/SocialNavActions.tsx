'use client';

import Link from 'next/link';
import { Bell, LoaderCircle, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getUnreadNotificationCount } from '@/lib/social/client';
import { useInvalidatedValueQuery } from '@/lib/social/hooks';
import { socialQueryKeys } from '@/lib/social/query-keys';

const actionLinkClassName =
  'relative inline-flex h-11 w-11 items-center justify-center rounded-full border-[2px] border-foreground bg-secondary text-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]';

function formatUnreadCount(count: number) {
  if (count > 99) {
    return '99+';
  }

  return String(count);
}

export function SocialNavActions() {
  const unreadCountQuery = useInvalidatedValueQuery(
    socialQueryKeys.unreadNotificationCount,
    getUnreadNotificationCount,
    { pollMs: 45000 }
  );
  const unreadCount = unreadCountQuery.data?.count ?? 0;

  return (
    <div className="flex items-center gap-3">
      <Link href="/friends" className={actionLinkClassName} aria-label="Open friends">
        <Users className="h-5 w-5" />
      </Link>
      <Link
        href="/notifications"
        className={actionLinkClassName}
        aria-label={`Open notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCountQuery.isRefreshing ? (
          <LoaderCircle className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-spin rounded-full bg-background" />
        ) : null}
        <span
          className={cn(
            'absolute -right-2 -top-2 min-w-6 rounded-full border-2 border-foreground bg-neo-coral px-1.5 py-0.5 text-[10px] font-bold leading-none shadow-[2px_2px_0_0_hsl(var(--foreground))]',
            unreadCount > 0 ? 'inline-flex items-center justify-center' : 'hidden'
          )}
        >
          {formatUnreadCount(unreadCount)}
        </span>
      </Link>
    </div>
  );
}
