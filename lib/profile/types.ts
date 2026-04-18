export type ProfileAccentColor = 'yellow' | 'teal' | 'magenta' | 'coral' | 'blue';

export type ProfileStats = {
  decksCreated: number;
  cardsStudied: number;
  masteredDecks: number;
  studyStreakDays: number;
};

export type ProfileActivity = {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestampLabel?: string;
  occurredAt?: string;
};

export type ProfileData = {
  id?: string;
  name: string;
  username?: string;
  handle?: string;
  tagline?: string;
  about?: string;
  bio?: string;
  email?: string;
  hasBeenOnboarded?: boolean;
  isPublicProfile?: boolean;
  dailyCardsGoal?: number;
  visibilityLabel?: string;
  joinedLabel?: string;
  initials: string;
  avatarColor: ProfileAccentColor;
  stats: ProfileStats;
  preferences: string[];
  recentActivity: ProfileActivity[];
};
