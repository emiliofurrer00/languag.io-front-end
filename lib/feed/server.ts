import 'server-only';

import { apiFetch } from '@/lib/api';
import { getRequiredApiAccessToken } from '@/lib/kinde-server';
import type {
  FeedActivity,
  FeedContinueStudyingDeck,
  FeedData,
  FeedDailyGoal,
  FeedStreak,
  FeedStreakDay,
  FeedSuggestedDeck,
  FeedSuggestedPerson,
  FeedSummary,
} from '@/lib/feed/types';

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function readNullableString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null;
}

function readNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function readBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeDailyGoal(value: unknown): FeedDailyGoal {
  const record = asRecord(value) ?? {};

  return {
    goal: readNumber(record.goal),
    progress: readNumber(record.progress),
    percentage: readNumber(record.percentage),
  };
}

function normalizeStreakDay(value: unknown): FeedStreakDay {
  const record = asRecord(value) ?? {};

  return {
    day: readString(record.day, 'Day'),
    done: readBoolean(record.done),
  };
}

function normalizeStreak(value: unknown): FeedStreak {
  const record = asRecord(value) ?? {};
  const rawDays = Array.isArray(record.days) ? record.days : [];

  return {
    current: readNumber(record.current),
    days: rawDays.map(normalizeStreakDay),
  };
}

function normalizeSummary(value: unknown): FeedSummary {
  const record = asRecord(value) ?? {};

  return {
    league: readNullableString(record.league),
    decks: readNumber(record.decks),
    cards: readNumber(record.cards),
  };
}

function normalizeContinueStudyingDeck(value: unknown): FeedContinueStudyingDeck {
  const record = asRecord(value) ?? {};

  return {
    id: readString(record.id),
    title: readString(record.title, 'Untitled Deck'),
    cards: readNumber(record.cards),
    progress: readNumber(record.progress),
    color: readString(record.color, 'bg-neo-yellow'),
    lastStudied: readString(record.lastStudied, 'Recently'),
    lastStudiedAtUtc: readNullableString(record.lastStudiedAtUtc),
  };
}

function normalizeActivity(value: unknown): FeedActivity {
  const record = asRecord(value) ?? {};

  return {
    userId: readString(record.userId),
    username: readNullableString(record.username),
    user: readString(record.user, 'A friend'),
    avatar: readString(record.avatar, 'U'),
    color: readString(record.color, 'bg-neo-teal'),
    action: readString(record.action, 'recorded activity in'),
    target: readNullableString(record.target),
    time: readString(record.time, 'Recently'),
    occurredAtUtc: readString(record.occurredAtUtc),
    followsYou: readBoolean(record.followsYou),
    isFollowing: readBoolean(record.isFollowing),
  };
}

function normalizeSuggestedPerson(value: unknown): FeedSuggestedPerson {
  const record = asRecord(value) ?? {};

  return {
    userId: readString(record.userId),
    username: readString(record.username),
    name: readString(record.name, 'Suggested learner'),
    handle: readString(record.handle),
    avatar: readString(record.avatar, 'U'),
    color: readString(record.color, 'bg-neo-blue'),
    bio: readString(record.bio, 'Learning with Languag.io'),
    friendshipStatus: readString(record.friendshipStatus, 'None'),
  };
}

function normalizeSuggestedDeck(value: unknown): FeedSuggestedDeck {
  const record = asRecord(value) ?? {};

  return {
    id: readString(record.id),
    title: readString(record.title, 'Untitled Deck'),
    cards: readNumber(record.cards),
    category: readString(record.category, 'General'),
    color: readString(record.color, 'bg-neo-coral'),
    progress: readNumber(record.progress),
    ownerUsername: readNullableString(record.ownerUsername),
  };
}

function normalizeFeed(value: unknown): FeedData {
  const record = asRecord(value) ?? {};
  const rawContinueStudying = Array.isArray(record.continueStudying) ? record.continueStudying : [];
  const rawFriendsActivity = Array.isArray(record.friendsActivity) ? record.friendsActivity : [];
  const rawSuggestedPeople = Array.isArray(record.suggestedPeople) ? record.suggestedPeople : [];
  const rawSuggestedDecks = Array.isArray(record.suggestedDecks) ? record.suggestedDecks : [];

  return {
    dailyGoal: normalizeDailyGoal(record.dailyGoal),
    streak: normalizeStreak(record.streak),
    summary: normalizeSummary(record.summary),
    continueStudying: rawContinueStudying.map(normalizeContinueStudyingDeck),
    friendsActivity: rawFriendsActivity.map(normalizeActivity),
    suggestedPeople: rawSuggestedPeople.map(normalizeSuggestedPerson),
    suggestedDecks: rawSuggestedDecks.map(normalizeSuggestedDeck),
  };
}

export async function getFeed() {
  const accessToken = await getRequiredApiAccessToken();
  const response = await apiFetch<unknown>('/Feed', {
    cache: 'no-store',
    accessToken,
  });

  return normalizeFeed(response);
}
