'use client';

import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Bell,
  Compass,
  Flame,
  Home,
  Layers,
  LogIn,
  LogOut,
  Plus,
  Sparkles,
  User,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SocialAvatar } from '@/components/social/SocialAvatar';
import { buildAuthContinuePath } from '@/lib/auth-flow';
import { getCurrentProfileSummary, type CurrentProfileSummary } from '@/lib/profile/client';
import { profileQueryKeys } from '@/lib/profile/query-keys';
import { useInvalidatedValueQuery } from '@/lib/social/hooks';
import { cn } from '@/lib/utils';

type DesktopNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

const navItems: DesktopNavItem[] = [
  { href: '/feed', label: 'Feed', icon: Home, match: (pathname) => pathname === '/feed' },
  {
    href: '/decks',
    label: 'My Decks',
    icon: Layers,
    match: (pathname) => pathname.startsWith('/decks'),
  },
  {
    href: '/sagas',
    label: 'Sagas',
    icon: Compass,
    match: (pathname) => pathname.startsWith('/sagas') || pathname === '/create-saga',
  },
  {
    href: '/friends',
    label: 'Friends',
    icon: Users,
    match: (pathname) => pathname.startsWith('/friends'),
  },
  {
    href: '/notifications',
    label: 'Notifications',
    icon: Bell,
    match: (pathname) => pathname.startsWith('/notifications'),
  },
  {
    href: '/profile/me',
    label: 'Profile',
    icon: User,
    match: (pathname) => pathname.startsWith('/profile'),
  },
];

// TODO: Replace with real streak and XP once app-shell stats are available outside the feed payload.
const placeholderStreak = 0;
const placeholderXp = 0;

function getDisplayName(
  user: ReturnType<typeof useKindeBrowserClient>['user'],
  profile?: CurrentProfileSummary | null
) {
  if (profile?.name) {
    return profile.name;
  }

  const fullName = [user?.given_name, user?.family_name].filter(Boolean).join(' ').trim();
  return fullName || user?.email || 'Learner';
}

function getHandle(
  user: ReturnType<typeof useKindeBrowserClient>['user'],
  profile?: CurrentProfileSummary | null
) {
  if (profile?.handle) {
    return profile.handle;
  }

  return user?.email?.split('@')[0] || 'learner';
}

export function DesktopSideNav() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const { data: currentProfile } = useInvalidatedValueQuery(
    profileQueryKeys.me,
    getCurrentProfileSummary,
    {
      enabled: !isLoading && Boolean(isAuthenticated),
    }
  );
  const displayName = getDisplayName(user, currentProfile);
  const handle = getHandle(user, currentProfile);
  const profileImageUrl = currentProfile?.profilePictureUrl ?? user?.picture ?? null;
  const postLoginRedirectUrl = buildAuthContinuePath('/feed');

  return (
    <aside
      className="fixed bottom-0 left-0 top-0 z-40 hidden w-60 flex-col border-r-[3px] border-foreground bg-background lg:flex"
      aria-label="Main navigation"
    >
      <Link
        href="/feed"
        className="flex items-center gap-2 border-b-[3px] border-foreground px-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-foreground bg-primary shadow-[3px_3px_0_0_hsl(var(--foreground))]">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="font-display text-xl font-bold">Languag.io</span>
      </Link>

      <div className="flex items-center gap-3 border-b-[2px] border-foreground/15 px-5 py-3">
        <div className="flex items-center gap-1.5 font-display text-sm font-bold">
          <Flame className="h-4 w-4 text-neo-coral" />
          <span>{placeholderStreak}</span>
        </div>
        <div className="flex items-center gap-1.5 font-display text-sm font-bold">
          <Zap className="h-4 w-4 text-primary" />
          <span>{placeholderXp}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active = item.match ? item.match(pathname) : pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl border-[2px] px-3 py-2.5 font-display text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                active
                  ? 'border-foreground bg-neo-yellow shadow-[3px_3px_0_0_hsl(var(--foreground))]'
                  : 'border-transparent hover:border-foreground hover:bg-secondary hover:shadow-[3px_3px_0_0_hsl(var(--foreground))]'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Link
          href="/decks/editor/new"
          className="mt-4 flex items-center gap-3 rounded-xl border-[2px] border-foreground bg-neo-magenta px-3 py-2.5 font-display text-sm font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Deck</span>
        </Link>
      </nav>

      <div className="space-y-1 border-t-[2px] border-foreground/15 p-3">
        {isLoading ? (
          <div className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground">
            Checking account
          </div>
        ) : null}

        {!isLoading && isAuthenticated ? (
          <>
            <Link
              href="/profile/me"
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <SocialAvatar
                label={displayName}
                imageUrl={profileImageUrl}
                fallbackClassName="bg-neo-teal"
                className="h-9 w-9 rounded-xl text-xs shadow-[2px_2px_0_0_hsl(var(--foreground))]"
                sizes="36px"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{displayName}</p>
                <p className="truncate text-[11px] text-muted-foreground">@{handle}</p>
              </div>
            </Link>
            <LogoutLink
              postLogoutRedirectURL="/"
              className="flex w-full items-center gap-3 rounded-xl border-[2px] border-transparent px-3 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </LogoutLink>
          </>
        ) : null}

        {!isLoading && !isAuthenticated ? (
          <>
            <LoginLink
              postLoginRedirectURL={postLoginRedirectUrl}
              className="flex w-full items-center gap-3 rounded-xl border-[2px] border-transparent px-3 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Log in</span>
            </LoginLink>
            <RegisterLink
              postLoginRedirectURL={postLoginRedirectUrl}
              className="flex w-full items-center gap-3 rounded-xl border-[2px] border-foreground bg-neo-yellow px-3 py-2 font-display text-sm font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Get started</span>
            </RegisterLink>
          </>
        ) : null}
      </div>
    </aside>
  );
}
