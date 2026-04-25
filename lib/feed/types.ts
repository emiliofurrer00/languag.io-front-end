export type FeedDailyGoal = {
  goal: number;
  progress: number;
  percentage: number;
};

export type FeedStreakDay = {
  day: string;
  done: boolean;
};

export type FeedStreak = {
  current: number;
  days: FeedStreakDay[];
};

export type FeedSummary = {
  league: string | null;
  decks: number;
  cards: number;
};

export type FeedContinueStudyingDeck = {
  id: string;
  title: string;
  cards: number;
  progress: number;
  color: string;
  lastStudied: string;
  lastStudiedAtUtc?: string | null;
};

export type FeedActivity = {
  userId: string;
  username?: string | null;
  user: string;
  avatar: string;
  profilePictureUrl?: string | null;
  color: string;
  action: string;
  target?: string | null;
  time: string;
  occurredAtUtc: string;
  followsYou: boolean;
  isFollowing: boolean;
};

export type FeedSuggestedPerson = {
  userId: string;
  username: string;
  name: string;
  handle: string;
  avatar: string;
  profilePictureUrl?: string | null;
  color: string;
  bio: string;
  friendshipStatus: string;
};

export type FeedSuggestedDeck = {
  id: string;
  title: string;
  cards: number;
  category: string;
  color: string;
  progress: number;
  ownerUsername?: string | null;
};

export type FeedData = {
  dailyGoal: FeedDailyGoal;
  streak: FeedStreak;
  summary: FeedSummary;
  continueStudying: FeedContinueStudyingDeck[];
  friendsActivity: FeedActivity[];
  suggestedPeople: FeedSuggestedPerson[];
  suggestedDecks: FeedSuggestedDeck[];
};
