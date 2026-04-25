'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { buildAuthContinuePath } from '@/lib/auth-flow';
import { cn } from '@/lib/utils';
import { NeoButton } from '@/components/ui/NeoButton';
import {
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  UserPlus,
  X,
  Group,
} from 'lucide-react';
import Link from 'next/link';

const landingLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
];

export default function Navbar({ isLandingPage = false }: { isLandingPage?: boolean }) {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const postLoginRedirectUrl = buildAuthContinuePath('/feed');
  const displayName = user?.given_name || user?.family_name || user?.email || 'User';
  const authButtonClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground font-semibold transition-all font-display',
    'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
    'px-4 py-2 text-sm'
  );
  const mobileDrawerItemClassName = cn(
    authButtonClassName,
    'w-full justify-between rounded-[1.35rem] px-4 py-3 text-base'
  );

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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground bg-primary shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold sm:text-xl">Languag.io</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {isLandingPage &&
              landingLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLoading ? (
              <>
                <NeoButton
                  variant="outline"
                  size="sm"
                  className="hidden cursor-progress sm:inline-flex"
                  type="button"
                  disabled
                >
                  Loading...
                </NeoButton>
                <NeoButton
                  variant="primary"
                  size="sm"
                  className="cursor-progress"
                  type="button"
                  disabled
                >
                  Please wait
                </NeoButton>
              </>
            ) : null}

            {!isLoading && !isAuthenticated ? (
              <>
                <LoginLink
                  postLoginRedirectURL={postLoginRedirectUrl}
                  className={cn(
                    authButtonClassName,
                    'hidden cursor-pointer bg-transparent text-foreground hover:bg-muted sm:inline-flex'
                  )}
                >
                  Log In
                </LoginLink>
                <RegisterLink
                  postLoginRedirectURL={postLoginRedirectUrl}
                  className={cn(
                    authButtonClassName,
                    'cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  Get Started
                </RegisterLink>
              </>
            ) : null}

            {!isLoading && isAuthenticated ? (
              <>
                <Link href="/decks" className="hidden sm:inline-flex">
                  <NeoButton variant="outline" size="sm" className="cursor-pointer">
                    My Decks
                  </NeoButton>
                </Link>
                <Link href="/profile/me" className="hidden sm:inline-flex">
                  <NeoButton variant="primary" size="sm" className="cursor-pointer">
                    {`Hi, ${displayName}!`}
                  </NeoButton>
                </Link>
                <LogoutLink
                  postLogoutRedirectURL="/"
                  className={cn(
                    authButtonClassName,
                    'hidden cursor-pointer bg-transparent text-foreground hover:bg-muted sm:inline-flex'
                  )}
                >
                  Log Out
                </LogoutLink>
              </>
            ) : null}

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-[2px] border-foreground bg-secondary text-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

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
          className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
          onClick={closeMobileMenu}
        />

        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={cn(
            'absolute right-0 top-0 flex h-full w-[min(86vw,22rem)] flex-col border-l-[3px] border-foreground bg-background px-5 pb-6 pt-5 shadow-[-6px_0_0_0_hsl(var(--foreground))] transition-transform duration-300 ease-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b-[2px] border-dashed border-foreground/20 pb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-foreground bg-primary shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold">Languag.io</p>
                  <p className="text-sm text-muted-foreground">
                    {isAuthenticated
                      ? `Signed in as ${displayName}`
                      : 'Everything that was getting squeezed now lives here.'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-foreground bg-card text-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              aria-label="Close navigation menu"
              onClick={closeMobileMenu}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {isLoading ? (
              <>
                <span
                  className={cn(
                    mobileDrawerItemClassName,
                    'cursor-progress bg-secondary text-secondary-foreground opacity-70'
                  )}
                >
                  <span>Loading your account</span>
                  <span className="text-sm uppercase tracking-[0.2em]">...</span>
                </span>
                <span
                  className={cn(
                    mobileDrawerItemClassName,
                    'cursor-progress bg-primary text-primary-foreground opacity-70'
                  )}
                >
                  <span>Please wait</span>
                  <span className="text-sm uppercase tracking-[0.2em]">...</span>
                </span>
              </>
            ) : null}

            {!isLoading && !isAuthenticated ? (
              <>
                <LoginLink
                  postLoginRedirectURL={postLoginRedirectUrl}
                  onClick={closeMobileMenu}
                  className={cn(
                    mobileDrawerItemClassName,
                    'bg-transparent text-foreground hover:bg-muted'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <LogIn className="h-4 w-4" />
                    Log In
                  </span>
                  <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Open
                  </span>
                </LoginLink>
                <RegisterLink
                  postLoginRedirectURL={postLoginRedirectUrl}
                  onClick={closeMobileMenu}
                  className={cn(
                    mobileDrawerItemClassName,
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <UserPlus className="h-4 w-4" />
                    Get Started
                  </span>
                  <span className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">
                    Join
                  </span>
                </RegisterLink>
              </>
            ) : null}

            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  href="/feed"
                  onClick={closeMobileMenu}
                  className={cn(
                    mobileDrawerItemClassName,
                    'bg-transparent text-foreground hover:bg-muted'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Group className="h-4 w-4" />
                    Feed
                  </span>
                  <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Open
                  </span>
                </Link>
                <Link
                  href="/decks"
                  onClick={closeMobileMenu}
                  className={cn(
                    mobileDrawerItemClassName,
                    'bg-transparent text-foreground hover:bg-muted'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4" />
                    My Decks
                  </span>
                  <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Open
                  </span>
                </Link>
                <Link
                  href="/profile/me"
                  onClick={closeMobileMenu}
                  className={cn(
                    mobileDrawerItemClassName,
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <UserRound className="h-4 w-4" />
                    {displayName}
                  </span>
                  <span className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">
                    Profile
                  </span>
                </Link>
                <LogoutLink
                  postLogoutRedirectURL="/"
                  onClick={closeMobileMenu}
                  className={cn(
                    mobileDrawerItemClassName,
                    'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </span>
                  <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Exit
                  </span>
                </LogoutLink>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
