import {
  Book,
  BookOpen,
  Calendar,
  FileStack,
  FlameIcon,
  Globe,
  Layers,
  Lock,
  Mail,
  ToolCase,
  Trophy,
  User,
} from 'lucide-react';
import type { ProfileData } from '@/lib/profile/types';
import NeoBox from '../ui/NeoBox';
import ProfilePicture from './ProfilePicture';

const statCards = [
  {
    key: 'decksCreated',
    label: 'Decks Created',
    colorClassName: 'bg-neo-yellow',
    icon: Layers,
  },
  {
    key: 'cardsStudied',
    label: 'Cards Studied',
    colorClassName: 'bg-neo-teal',
    icon: BookOpen,
  },
  {
    key: 'masteredDecks',
    label: 'Mastered Decks',
    colorClassName: 'bg-neo-magenta',
    icon: Trophy,
  },
  {
    key: 'studyStreakDays',
    label: 'Study Streak Days',
    colorClassName: 'bg-neo-coral',
    icon: FlameIcon,
  },
] as const;

function formatHandle(handle?: string) {
  if (!handle) {
    return null;
  }

  return handle.startsWith('@') ? handle : `@${handle}`;
}

function getActivityIcon(type: string) {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes('master')) {
    return Trophy;
  }

  if (normalizedType.includes('study') || normalizedType.includes('card')) {
    return Book;
  }

  return FileStack;
}

export default function ProfilePageContainer({ profile }: { profile: ProfileData }) {
  const metaItems = [profile.email, profile.visibilityLabel].filter(Boolean);
  const taglineCopy = profile.tagline || profile.bio || 'Your profile details appear here.';
  const aboutCopy = profile.about || profile.bio || 'No profile details have been added yet.';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <NeoBox className="flex flex-col gap-4 text-center md:flex-row md:items-start md:gap-8 md:text-left">
        <div>
          <ProfilePicture initials={profile.initials} color={profile.avatarColor} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          {profile.handle ? (
            <p className="mb-2 text-sm text-gray-500">{formatHandle(profile.handle)}</p>
          ) : null}
          <p className="mb-4 text-sm">{taglineCopy}</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 md:justify-start">
            <div className="flex items-center gap-1">
              <Mail width={12} height={12} />
              <p key={profile.email}>{profile.email}</p>
            </div>
            <div className="flex items-center gap-1">
              {profile.visibilityLabel === 'Public' ? (
                <Globe width={12} height={12} />
              ) : (
                <Lock width={12} height={12} />
              )}
              <p key={profile.visibilityLabel}>{profile.visibilityLabel}</p>
            </div>
          </div>
        </div>
      </NeoBox>
      {/* Profile Stats */}
      {/* use 4 neoboxes to be displayed in two rows */}
      <div className="mt-8 grid grid-cols-2 grid-rows-2 gap-4 lg:grid-cols-4 lg:grid-rows-1">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = profile.stats[card.key];

          return (
            <NeoBox
              key={card.key}
              className="flex flex-col items-center gap-2 text-center"
              shadowOffset="3px"
            >
              <NeoBox
                padding="p-3"
                className={card.colorClassName}
                shadowOffset="3px"
                borderWidth="2px"
              >
                <Icon className="h-6 w-6 text-foreground" />
              </NeoBox>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs">{card.label}</p>
              </div>
            </NeoBox>
          );
        })}
      </div>
      {/* About & Preferences */}
      <div className="mt-8 grid grid-cols-1 grid-rows-2 gap-6 md:grid-cols-2 md:grid-rows-1">
        <NeoBox alignItems="start" justifyContent="start">
          <div className="flex items-center gap-1 mb-4">
            <User className="w-6 h-6" />
            <h6 className="text-left font-semibold text-xl">About</h6>
          </div>
          <p className="text-sm">{aboutCopy}</p>
          {profile.joinedLabel ? (
            <div className="mt-3 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <p className="text-sm">{`Joined ${profile.joinedLabel}`}</p>
            </div>
          ) : null}
        </NeoBox>
        <NeoBox alignItems="start" justifyContent="start">
          <div className="flex items-center gap-1">
            <ToolCase className="w-6 h-6" />
            <h6 className="text-left font-semibold text-xl">Preferences</h6>
          </div>
          {profile.preferences.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.preferences.map((preference) => (
                <span
                  key={preference}
                  className="rounded-full border-2 border-foreground bg-secondary px-3 py-2 text-sm shadow-[3px_3px_0_0_hsl(var(--foreground))]"
                >
                  {preference}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No preferences have been saved yet.
            </p>
          )}
        </NeoBox>
      </div>
      {/* Recent Activity */}
      <div className="mt-8">
        <NeoBox alignItems="start" justifyContent="start">
          <h6 className="text-lg font-semibold mb-4">Recent Activity</h6>
          {profile.recentActivity.length > 0 ? (
            <ul className="space-y-3">
              {profile.recentActivity.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);

                return (
                  <li key={activity.id} className="flex items-center gap-3">
                    <ActivityIcon className="h-5 w-5 text-foreground" />
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      {activity.description ? (
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      ) : null}
                      {activity.timestampLabel ? (
                        <p className="text-xs text-gray-500">{activity.timestampLabel}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          )}
        </NeoBox>
      </div>
    </div>
  );
}
