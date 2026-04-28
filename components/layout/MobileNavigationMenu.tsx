'use client';

import { useEffect, useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpen,
  Group,
  Home,
  LoaderCircle,
  LogIn,
  LogOut,
  Menu,
  Plus,
  Sparkles,
  UserPlus,
  UserRound,
  Users,
  X,
} from 'lucide-react';

import { buildAuthContinuePath } from '@/lib/auth-flow';
import { cn } from '@/lib/utils';

type DrawerLink = {
  href: string;
  label: string;
  actionLabel: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary';
};

type MobileNavigationMenuProps = {
  className?: string;
  triggerClassName?: string;
};

const drawerItemClassName = cn(
  'inline-flex min-h-[3.25rem] w-full items-center justify-between gap-4 rounded-[1.35rem] border-[2px] border-foreground px-4 py-3 font-display text-base font-semibold transition-all',
  'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
);

const authenticatedLinks: DrawerLink[] = [
  { href: '/feed', label: 'Feed', actionLabel: 'Open', icon: Group },
  { href: '/decks', label: 'My Decks', actionLabel: 'Open', icon: BookOpen },
  //{ href: '/decks/editor/new', label: 'Create Deck', actionLabel: 'New', icon: Plus },
  { href: '/friends', label: 'Friends', actionLabel: 'Open', icon: Users },
  //{ href: '/notifications', label: 'Notifications', actionLabel: 'Open', icon: Bell },
  {
    href: '/profile/me',
    label: 'Profile',
    actionLabel: 'View',
    icon: UserRound,
    variant: 'primary',
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href;
}

function drawerToneClassName(isActive: boolean, variant: DrawerLink['variant']) {
  if (isActive) {
    return 'bg-primary text-primary-foreground hover:bg-primary/90';
  }

  if (variant === 'primary') {
    return 'bg-primary text-primary-foreground hover:bg-primary/90';
  }

  return 'bg-transparent text-foreground hover:bg-muted';
}

export function MobileNavigationMenu({ className, triggerClassName }: MobileNavigationMenuProps) {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const drawerId = `mobile-navigation-drawer-${useId().replace(/:/g, '')}`;
  const displayName = user?.given_name || user?.family_name || user?.email || 'User';
  const postLoginRedirectUrl = buildAuthContinuePath('/feed');
  const isLandingActive = pathname === '/';

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeMenuOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeMenuOnEscape);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener('change', closeMenuOnDesktop);

    return () => mediaQuery.removeEventListener('change', closeMenuOnDesktop);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className={cn('inline-flex sm:hidden', className)}>
      <button
        type="button"
        className={cn(
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-secondary text-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all',
          'hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          triggerClassName
        )}
        aria-label="Open navigation menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls={drawerId}
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={cn(
          'fixed inset-0 z-60 transition-opacity duration-200 sm:hidden',
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px] h-screen"
          onClick={closeMobileMenu}
        />

        <div
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={cn(
            'absolute right-0 top-0 flex h-screen w-[min(86vw,22rem)] flex-col border-l-[3px] border-foreground bg-background px-5 pb-6 pt-5 shadow-[-6px_0_0_0_hsl(var(--foreground))] transition-transform duration-300 ease-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b-[2px] border-dashed border-foreground/20 pb-4">
            <div className="min-w-0 space-y-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-primary shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-bold">Languag.io</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {isAuthenticated ? `Signed in as ${displayName}` : 'Your learning links'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-card text-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              aria-label="Close navigation menu"
              onClick={closeMobileMenu}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 space-y-3 overflow-y-auto pb-2 px-1">
            {isLoading ? (
              <span
                className={cn(
                  drawerItemClassName,
                  'cursor-progress bg-secondary text-secondary-foreground opacity-70'
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <LoaderCircle className="h-4 w-4 shrink-0 animate-spin" />
                  <span className="truncate">Loading your account</span>
                </span>
              </span>
            ) : null}

            {!isLoading && !isAuthenticated ? (
              <>
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className={cn(
                    drawerItemClassName,
                    drawerToneClassName(isLandingActive, 'default')
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Home className="h-4 w-4 shrink-0" />
                    <span className="truncate">Landing</span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-[10px] uppercase tracking-[0.16em]',
                      isLandingActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}
                  >
                    Home
                  </span>
                </Link>
                <LoginLink
                  postLoginRedirectURL={postLoginRedirectUrl}
                  onClick={closeMobileMenu}
                  className={cn(
                    drawerItemClassName,
                    'bg-transparent text-foreground hover:bg-muted'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <LogIn className="h-4 w-4 shrink-0" />
                    <span className="truncate">Log In</span>
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Open
                  </span>
                </LoginLink>
                <RegisterLink
                  postLoginRedirectURL={postLoginRedirectUrl}
                  onClick={closeMobileMenu}
                  className={cn(
                    drawerItemClassName,
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <UserPlus className="h-4 w-4 shrink-0" />
                    <span className="truncate">Get Started</span>
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-primary-foreground/70">
                    Join
                  </span>
                </RegisterLink>
              </>
            ) : null}

            {!isLoading && isAuthenticated ? (
              <>
                {authenticatedLinks.map(({ href, label, actionLabel, icon: Icon, variant }) => {
                  const isActive = isActivePath(pathname, href);

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMobileMenu}
                      className={cn(drawerItemClassName, drawerToneClassName(isActive, variant))}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{label}</span>
                      </span>
                      <span
                        className={cn(
                          'shrink-0 text-[10px] uppercase tracking-[0.16em]',
                          isActive || variant === 'primary'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {isActive ? 'Here' : actionLabel}
                      </span>
                    </Link>
                  );
                })}
                <LogoutLink
                  postLogoutRedirectURL="/"
                  onClick={closeMobileMenu}
                  className={cn(
                    drawerItemClassName,
                    'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="truncate">Log Out</span>
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Exit
                  </span>
                </LogoutLink>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
