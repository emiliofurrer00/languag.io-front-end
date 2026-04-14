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
};

export type ProfileData = {
  name: string;
  handle?: string;
  bio?: string;
  email?: string;
  visibilityLabel?: string;
  joinedLabel?: string;
  initials: string;
  avatarColor: ProfileAccentColor;
  stats: ProfileStats;
  preferences: string[];
  recentActivity: ProfileActivity[];
};
