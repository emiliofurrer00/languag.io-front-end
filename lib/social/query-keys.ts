export const socialQueryKeys = {
  friends: 'friends:list',
  incomingRequests: 'friends:incoming',
  outgoingRequests: 'friends:outgoing',
  notifications: 'notifications:list',
  unreadNotificationCount: 'notifications:unread-count',
  friendshipStatus: (userId: string) => `friends:status:${userId}`,
} as const;
