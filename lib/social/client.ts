import { apiFetch } from '@/lib/api';
import {
  type CursorPage,
  type FriendRequest,
  type FriendSummary,
  type FriendshipStatus,
  type NotificationItem,
  type UnreadNotificationCount,
  normalizeCursorPage,
  normalizeFriendRequest,
  normalizeFriendshipStatus,
  normalizeFriendSummary,
  normalizeNotificationItem,
  normalizeUnreadCount,
} from '@/lib/social/types';

type CursorQueryOptions = {
  cursor?: string | null;
  pageSize?: number;
};

function buildCursorQuery({ cursor, pageSize = 20 }: CursorQueryOptions = {}) {
  const searchParams = new URLSearchParams();

  if (cursor) {
    searchParams.set('cursor', cursor);
  }

  searchParams.set('pageSize', String(pageSize));

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
}

export async function sendFriendRequest(targetUserId: string) {
  return apiFetch<{ requestId: string }>(`/api/friends/requests`, {
    method: 'POST',
    body: JSON.stringify({ targetUserId }),
    useApiBaseUrl: false,
  });
}

export async function acceptFriendRequest(requestId: string) {
  return apiFetch<void>(`/api/friends/requests/${requestId}/accept`, {
    method: 'POST',
    useApiBaseUrl: false,
  });
}

export async function rejectFriendRequest(requestId: string) {
  return apiFetch<void>(`/api/friends/requests/${requestId}/reject`, {
    method: 'POST',
    useApiBaseUrl: false,
  });
}

export async function cancelFriendRequest(requestId: string) {
  return apiFetch<void>(`/api/friends/requests/${requestId}/cancel`, {
    method: 'POST',
    useApiBaseUrl: false,
  });
}

export async function removeFriend(friendUserId: string) {
  return apiFetch<void>(`/api/friends/${friendUserId}`, {
    method: 'DELETE',
    useApiBaseUrl: false,
  });
}

export async function getIncomingFriendRequests(options?: CursorQueryOptions): Promise<CursorPage<FriendRequest>> {
  const response = await apiFetch<unknown>(
    `/api/friends/requests/incoming${buildCursorQuery(options)}`,
    {
      useApiBaseUrl: false,
      cache: 'no-store',
    }
  );

  return normalizeCursorPage(response, normalizeFriendRequest);
}

export async function getOutgoingFriendRequests(options?: CursorQueryOptions): Promise<CursorPage<FriendRequest>> {
  const response = await apiFetch<unknown>(
    `/api/friends/requests/outgoing${buildCursorQuery(options)}`,
    {
      useApiBaseUrl: false,
      cache: 'no-store',
    }
  );

  return normalizeCursorPage(response, normalizeFriendRequest);
}

export async function getFriends(options?: CursorQueryOptions): Promise<CursorPage<FriendSummary>> {
  const response = await apiFetch<unknown>(`/api/friends${buildCursorQuery(options)}`, {
    useApiBaseUrl: false,
    cache: 'no-store',
  });

  return normalizeCursorPage(response, normalizeFriendSummary);
}

export async function getFriendshipStatus(otherUserId: string): Promise<FriendshipStatus> {
  const response = await apiFetch<unknown>(`/api/friends/status/${otherUserId}`, {
    useApiBaseUrl: false,
    cache: 'no-store',
  });

  return normalizeFriendshipStatus(response);
}

export async function getNotifications(
  options?: CursorQueryOptions
): Promise<CursorPage<NotificationItem>> {
  const response = await apiFetch<unknown>(`/api/notifications${buildCursorQuery(options)}`, {
    useApiBaseUrl: false,
    cache: 'no-store',
  });

  return normalizeCursorPage(response, normalizeNotificationItem);
}

export async function getUnreadNotificationCount(): Promise<UnreadNotificationCount> {
  const response = await apiFetch<unknown>(`/api/notifications/unread-count`, {
    useApiBaseUrl: false,
    cache: 'no-store',
  });

  return normalizeUnreadCount(response);
}

export async function markNotificationRead(notificationId: string) {
  return apiFetch<void>(`/api/notifications/${notificationId}/read`, {
    method: 'POST',
    useApiBaseUrl: false,
  });
}

export async function markAllNotificationsRead() {
  return apiFetch<{ updatedCount: number }>(`/api/notifications/read-all`, {
    method: 'POST',
    useApiBaseUrl: false,
  });
}
