export type CursorPage<T> = {
  items: T[];
  nextCursor?: string | null;
};

export type FriendshipStatus = 'None' | 'Friends' | 'IncomingPending' | 'OutgoingPending';

export type FriendRequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';

export type FriendRequest = {
  id: string;
  senderId: string;
  senderDisplayName: string;
  senderAvatarUrl?: string | null;
  receiverId: string;
  receiverDisplayName: string;
  receiverAvatarUrl?: string | null;
  status: FriendRequestStatus;
  createdAtUtc: string;
  createdAtLabel: string;
};

export type FriendSummary = {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  friendsSinceUtc: string;
  friendsSinceLabel: string;
};

export type NotificationType = 'FriendRequestReceived' | 'FriendRequestAccepted';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  actorUserId?: string | null;
  actorDisplayName?: string | null;
  actorAvatarUrl?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  title?: string | null;
  body?: string | null;
  isRead: boolean;
  createdAtUtc: string;
  createdAtLabel: string;
};

export type UnreadNotificationCount = {
  count: number;
};

function formatDateLabel(value: string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return 'Recently';
  }

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat(
    'en-US',
    options ?? {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  ).format(date);
}

export function getDisplayInitials(value: string | null | undefined) {
  if (!value) {
    return 'U';
  }

  const parts = value
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return 'U';
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function normalizeCursorPage<T>(value: unknown, normalizeItem: (item: unknown) => T): CursorPage<T> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { items: [], nextCursor: null };
  }

  const record = value as Record<string, unknown>;
  const rawItems = Array.isArray(record.items) ? record.items : [];

  return {
    items: rawItems.map(normalizeItem),
    nextCursor: typeof record.nextCursor === 'string' ? record.nextCursor : null,
  };
}

export function normalizeFriendRequest(value: unknown): FriendRequest {
  const record = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;

  return {
    id: typeof record.id === 'string' ? record.id : '',
    senderId: typeof record.senderId === 'string' ? record.senderId : '',
    senderDisplayName:
      typeof record.senderDisplayName === 'string' && record.senderDisplayName.trim()
        ? record.senderDisplayName
        : 'Unknown user',
    senderAvatarUrl: typeof record.senderAvatarUrl === 'string' ? record.senderAvatarUrl : null,
    receiverId: typeof record.receiverId === 'string' ? record.receiverId : '',
    receiverDisplayName:
      typeof record.receiverDisplayName === 'string' && record.receiverDisplayName.trim()
        ? record.receiverDisplayName
        : 'Unknown user',
    receiverAvatarUrl: typeof record.receiverAvatarUrl === 'string' ? record.receiverAvatarUrl : null,
    status:
      typeof record.status === 'string' && record.status.trim()
        ? (record.status as FriendRequestStatus)
        : 'Pending',
    createdAtUtc: typeof record.createdAtUtc === 'string' ? record.createdAtUtc : '',
    createdAtLabel: formatDateLabel(
      typeof record.createdAtUtc === 'string' ? record.createdAtUtc : undefined
    ),
  };
}

export function normalizeFriendSummary(value: unknown): FriendSummary {
  const record = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;

  return {
    userId: typeof record.userId === 'string' ? record.userId : '',
    displayName:
      typeof record.displayName === 'string' && record.displayName.trim()
        ? record.displayName
        : 'Unknown user',
    avatarUrl: typeof record.avatarUrl === 'string' ? record.avatarUrl : null,
    friendsSinceUtc: typeof record.friendsSinceUtc === 'string' ? record.friendsSinceUtc : '',
    friendsSinceLabel: formatDateLabel(
      typeof record.friendsSinceUtc === 'string' ? record.friendsSinceUtc : undefined
    ),
  };
}

export function normalizeFriendshipStatus(value: unknown): FriendshipStatus {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return 'None';
  }

  const status = (value as Record<string, unknown>).status;
  return typeof status === 'string' && status.trim() ? (status as FriendshipStatus) : 'None';
}

export function normalizeNotificationItem(value: unknown): NotificationItem {
  const record = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;

  return {
    id: typeof record.id === 'string' ? record.id : '',
    type:
      typeof record.type === 'string' && record.type.trim()
        ? (record.type as NotificationType)
        : 'FriendRequestReceived',
    actorUserId: typeof record.actorUserId === 'string' ? record.actorUserId : null,
    actorDisplayName:
      typeof record.actorDisplayName === 'string' ? record.actorDisplayName : null,
    actorAvatarUrl: typeof record.actorAvatarUrl === 'string' ? record.actorAvatarUrl : null,
    entityType: typeof record.entityType === 'string' ? record.entityType : null,
    entityId: typeof record.entityId === 'string' ? record.entityId : null,
    title: typeof record.title === 'string' ? record.title : null,
    body: typeof record.body === 'string' ? record.body : null,
    isRead: Boolean(record.isRead),
    createdAtUtc: typeof record.createdAtUtc === 'string' ? record.createdAtUtc : '',
    createdAtLabel: formatDateLabel(
      typeof record.createdAtUtc === 'string' ? record.createdAtUtc : undefined,
      {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    ),
  };
}

export function normalizeUnreadCount(value: unknown): UnreadNotificationCount {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { count: 0 };
  }

  const count = (value as Record<string, unknown>).count;

  return {
    count: typeof count === 'number' && Number.isFinite(count) ? count : 0,
  };
}
