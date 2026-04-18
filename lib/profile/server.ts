import 'server-only';

import { apiFetch } from '@/lib/api';
import { getOptionalApiAccessToken, getRequiredApiAccessToken } from '@/lib/kinde-server';
import type { ProfileAccentColor, ProfileActivity, ProfileData } from '@/lib/profile/types';

type JsonRecord = Record<string, unknown>;

const accentColors: ProfileAccentColor[] = ['yellow', 'teal', 'magenta', 'coral', 'blue'];

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function firstNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function readFirstValue(sources: JsonRecord[], keys: string[]) {
  for (const source of sources) {
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null) {
        return source[key];
      }
    }
  }

  return undefined;
}

function readFirstString(sources: JsonRecord[], keys: string[]) {
  return firstString(...sources.flatMap((source) => keys.map((key) => source[key])));
}

function readFirstNumber(sources: JsonRecord[], keys: string[]) {
  return firstNumber(...sources.flatMap((source) => keys.map((key) => source[key])));
}

function collectRecords(sources: JsonRecord[], keys: string[]) {
  const records: JsonRecord[] = [];

  for (const source of sources) {
    for (const key of keys) {
      const record = asRecord(source[key]);
      if (record) {
        records.push(record);
      }
    }
  }

  return records;
}

function readFirstArray(sources: JsonRecord[], keys: string[]) {
  for (const source of sources) {
    for (const key of keys) {
      const value = source[key];
      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  return [];
}

function toLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDateLabel(
  value: unknown,
  options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }
) {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return undefined;
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function normalizeVisibility(value: unknown) {
  if (typeof value === 'boolean') {
    return value ? 'Public' : 'Private';
  }

  if (typeof value === 'string' && value.trim()) {
    return toLabel(value);
  }

  return undefined;
}

function normalizeAccentColor(value: unknown): ProfileAccentColor {
  if (typeof value !== 'string') {
    return 'teal';
  }

  const normalized = value.trim().toLowerCase().replace(/^bg-/, '').replace(/^neo-/, '');
  return accentColors.includes(normalized as ProfileAccentColor)
    ? (normalized as ProfileAccentColor)
    : 'teal';
}

function buildInitials(name?: string, email?: string) {
  const source = name || email || 'User';
  const parts = source
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

function formatPreferenceEntries(value: unknown): string[] {
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => formatPreferenceEntries(item));
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  return Object.entries(record).flatMap(([key, entryValue]) => {
    if (entryValue === null || entryValue === undefined || entryValue === '') {
      return [];
    }

    if (typeof entryValue === 'boolean') {
      return [`${toLabel(key)}: ${entryValue ? 'Yes' : 'No'}`];
    }

    if (typeof entryValue === 'number') {
      return [`${toLabel(key)}: ${entryValue}`];
    }

    if (typeof entryValue === 'string' && entryValue.trim()) {
      return [`${toLabel(key)}: ${entryValue.trim()}`];
    }

    if (Array.isArray(entryValue)) {
      const items = entryValue
        .flatMap((item) => (typeof item === 'string' && item.trim() ? [item.trim()] : []))
        .filter(Boolean);

      return items.length > 0 ? [`${toLabel(key)}: ${items.join(', ')}`] : [];
    }

    return [];
  });
}

function normalizePreferences(value: unknown) {
  return [...new Set(formatPreferenceEntries(value))].slice(0, 8);
}

function normalizeActivities(value: unknown): ProfileActivity[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item, index) => {
    const record = asRecord(item);
    if (!record) {
      return [];
    }

    const title =
      firstString(record.title, record.message, record.action, record.event, record.name) ||
      'Recent activity';
    const description = firstString(record.description, record.details, record.subtitle);
    const type = firstString(record.type, record.kind, record.category) || 'activity';
    const timestampLabel = formatDateLabel(
      firstString(record.occurredAt, record.createdAt, record.timestamp, record.updatedAt),
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
    const idValue = record.id;
    const id =
      typeof idValue === 'string' || typeof idValue === 'number'
        ? String(idValue)
        : `activity-${index}`;

    return [
      {
        id,
        type,
        title,
        description,
        timestampLabel,
      },
    ];
  });
}

function normalizeProfileResponse(response: unknown): ProfileData {
  const root = asRecord(response) ?? {};
  const payload =
    asRecord(root.data) ??
    asRecord(root.payload) ??
    asRecord(root.me) ??
    asRecord(root.profile) ??
    asRecord(root.user) ??
    root;
  const nestedSources = collectRecords(
    [payload, root],
    ['profile', 'user', 'me', 'payload', 'data']
  );
  const sources = [payload, ...nestedSources, root];
  const statsSources = [
    ...collectRecords(sources, ['stats', 'profileStats', 'counts', 'metrics']),
    ...sources,
  ];
  const avatarSources = [...collectRecords(sources, ['avatar', 'profilePicture']), ...sources];

  const email = readFirstString(sources, ['email']);
  const userId = firstString(root.id, payload.id);
  const username = readFirstString(sources, ['username', 'userName', 'handle', 'login']);
  const firstName = readFirstString(sources, ['firstName', 'givenName', 'given_name']);
  const lastName = readFirstString(sources, ['lastName', 'familyName', 'family_name']);
  const composedName = [firstName, lastName].filter(Boolean).join(' ');
  const emailLocalPart = email?.split('@')[0];
  const name =
    readFirstString(sources, ['displayName', 'fullName', 'name']) ||
    composedName ||
    username ||
    emailLocalPart ||
    'User';
  const handle = username || emailLocalPart;
  const tagline = readFirstString(sources, ['profileDescription', 'tagline', 'bio', 'description']);
  const about = readFirstString(sources, ['about', 'aboutMe']);
  const bio = about || tagline;
  const hasBeenOnboarded = Boolean(readFirstValue(sources, ['hasBeenOnboarded']));
  const isPublicProfile = Boolean(
    readFirstValue(sources, ['isPublicProfile', 'isPublic', 'public'])
  );
  const dailyCardsGoal = readFirstNumber(sources, ['dailyCardsGoal', 'dailyGoal']) ?? 0;
  const visibilityLabel = normalizeVisibility(
    readFirstValue(sources, [
      'visibility',
      'profileVisibility',
      'isPublic',
      'public',
      'isPublicProfile',
    ])
  );
  const joinedLabel = formatDateLabel(
    readFirstValue(sources, ['joinedAt', 'createdAt', 'registeredAt', 'memberSince'])
  );
  const initials = readFirstString(avatarSources, ['initials']) || buildInitials(name, email);
  const avatarColor = normalizeAccentColor(
    readFirstValue(avatarSources, ['avatarColor', 'accentColor', 'themeColor', 'color'])
  );
  const decks = readFirstArray(sources, ['decks']);

  return {
    id: userId,
    name,
    username,
    handle,
    tagline,
    about,
    bio,
    email,
    hasBeenOnboarded,
    isPublicProfile,
    dailyCardsGoal,
    visibilityLabel,
    joinedLabel,
    initials,
    avatarColor,
    stats: {
      decksCreated:
        readFirstNumber(statsSources, [
          'decksCreated',
          'createdDeckCount',
          'deckCount',
          'decksCount',
        ]) ?? decks.length,
      cardsStudied:
        readFirstNumber(statsSources, ['cardsStudied', 'studiedCards', 'studiedCardCount']) ?? 0,
      masteredDecks:
        readFirstNumber(statsSources, ['masteredDecks', 'masteredCount', 'masteredDeckCount']) ?? 0,
      studyStreakDays:
        readFirstNumber(statsSources, [
          'studyStreakDays',
          'streakDays',
          'currentStreak',
          'studyStreak',
        ]) ?? 0,
    },
    preferences: normalizePreferences(readFirstValue(sources, ['preferences', 'settings'])),
    recentActivity: normalizeActivities(
      readFirstArray(sources, ['recentActivity', 'activity', 'recentEvents', 'events'])
    ),
  };
}

function isNotFoundError(error: unknown) {
  return error instanceof Error && error.message.includes('Not Found');
}

function buildPublicProfileEndpointPath(userId: string) {
  return `/Users/${encodeURIComponent(userId)}`;
}

export async function getMyProfile() {
  const accessToken = await getRequiredApiAccessToken();
  const response = await apiFetch<unknown>('/Users/me', {
    cache: 'no-store',
    accessToken,
  });

  return normalizeProfileResponse(response);
}

export async function getMyProfileIfAuthenticated() {
  const accessToken = await getOptionalApiAccessToken();

  if (!accessToken) {
    return null;
  }

  const response = await apiFetch<unknown>('/Users/me', {
    cache: 'no-store',
    accessToken,
  });

  return normalizeProfileResponse(response);
}

export async function getPublicProfile(userId: string) {
  try {
    const response = await apiFetch<unknown>(buildPublicProfileEndpointPath(userId), {
      cache: 'no-store',
    });

    return normalizeProfileResponse(response);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export function buildPendingPublicProfile(userId: string): ProfileData {
  const normalizedHandle = userId.trim();

  return {
    name: 'Public Profile',
    handle: normalizedHandle,
    bio: 'This public profile page is ready, and it will populate once the backend public-profile endpoint is added.',
    visibilityLabel: 'Public Profile',
    initials: buildInitials(normalizedHandle),
    avatarColor: 'blue',
    stats: {
      decksCreated: 0,
      cardsStudied: 0,
      masteredDecks: 0,
      studyStreakDays: 0,
    },
    preferences: [],
    recentActivity: [],
  };
}
