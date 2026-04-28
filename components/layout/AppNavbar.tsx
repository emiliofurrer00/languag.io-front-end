'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { BookOpen, Group, LogOut, Sparkles, UserPlus, UserRound } from 'lucide-react';

import { buildAuthContinuePath } from '@/lib/auth-flow';
import { cn } from '@/lib/utils';
import { NeoButton } from '@/components/ui/NeoButton';
import { MobileNavigationMenu } from '@/components/layout/MobileNavigationMenu';

type DesktopNavLink = {
  href: string;
  label: string;
};

type AppNavbarProps = {
  title?: string;
  brandHref?: string;
  leftContent?: ReactNode;
  desktopLinks?: DesktopNavLink[];
  actions?: ReactNode;
  mobileActions?: ReactNode;
  showDesktopAuthActions?: boolean;
  className?: string;
  contentClassName?: string;
};

const linkButtonClassName = cn(
  'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground px-4 py-2 font-display text-sm font-semibold transition-all',
  'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
);

function isActivePath(pathname: string, href: string) {
  if (href.startsWith('#')) {
    return false;
  }

  if (href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function DefaultLeftContent({ brandHref, title }: { brandHref: string; title: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link
        href={brandHref}
        aria-label="Go to home"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-primary shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Sparkles className="h-5 w-5" />
      </Link>
      <span className="truncate font-display text-lg font-bold sm:text-xl">{title}</span>
    </div>
  );
}

function DesktopLinks({ links }: { links: DesktopNavLink[] }) {
  const pathname = usePathname();

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="hidden items-center gap-8 md:flex">
      {links.map((link) => {
        const className = cn(
          'font-medium transition-colors hover:text-primary',
          isActivePath(pathname, link.href) ? 'text-primary' : 'text-foreground'
        );

        if (link.href.startsWith('#')) {
          return (
            <a key={link.href} href={link.href} className={className}>
              {link.label}
            </a>
          );
        }

        return (
          <Link key={link.href} href={link.href} className={className}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

function DesktopAuthActions() {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const postLoginRedirectUrl = buildAuthContinuePath('/feed');
  const displayName = user?.given_name || user?.family_name || user?.email || 'Profile';

  if (isLoading) {
    return (
      <>
        <NeoButton
          variant="outline"
          size="sm"
          className="hidden cursor-progress sm:inline-flex"
          disabled
        >
          Loading...
        </NeoButton>
        <NeoButton
          variant="primary"
          size="sm"
          className="hidden cursor-progress sm:inline-flex"
          disabled
        >
          Please wait
        </NeoButton>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginLink
          postLoginRedirectURL={postLoginRedirectUrl}
          className={cn(
            linkButtonClassName,
            'hidden cursor-pointer bg-transparent text-foreground hover:bg-muted sm:inline-flex'
          )}
        >
          Log In
        </LoginLink>
        <RegisterLink
          postLoginRedirectURL={postLoginRedirectUrl}
          className={cn(
            linkButtonClassName,
            'hidden cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 sm:inline-flex'
          )}
        >
          <UserPlus className="h-4 w-4" />
          Get Started
        </RegisterLink>
      </>
    );
  }

  return (
    <>
      <Link
        href="/feed"
        className={cn(
          linkButtonClassName,
          'hidden bg-transparent text-foreground hover:bg-muted sm:inline-flex'
        )}
      >
        <Group className="h-4 w-4" />
        Feed
      </Link>
      <Link
        href="/decks"
        className={cn(
          linkButtonClassName,
          'hidden bg-transparent text-foreground hover:bg-muted sm:inline-flex'
        )}
      >
        <BookOpen className="h-4 w-4" />
        My Decks
      </Link>
      <Link
        href="/profile/me"
        className={cn(
          linkButtonClassName,
          'hidden bg-primary text-primary-foreground hover:bg-primary/90 sm:inline-flex'
        )}
      >
        <UserRound className="h-4 w-4" />
        {displayName}
      </Link>
      <LogoutLink
        postLogoutRedirectURL="/"
        className={cn(
          linkButtonClassName,
          'hidden cursor-pointer bg-transparent text-foreground hover:bg-muted sm:inline-flex'
        )}
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </LogoutLink>
    </>
  );
}

export default function AppNavbar({
  title = 'Languag.io',
  brandHref = '/',
  leftContent,
  desktopLinks = [],
  actions,
  mobileActions,
  showDesktopAuthActions = false,
  className,
  contentClassName,
}: AppNavbarProps) {
  return (
    <nav
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b-3 bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4',
          contentClassName
        )}
      >
        <div className="min-w-0 flex-1">
          {leftContent ?? <DefaultLeftContent brandHref={brandHref} title={title} />}
        </div>

        <DesktopLinks links={desktopLinks} />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {mobileActions ? (
            <div className="flex items-center gap-2 sm:hidden">{mobileActions}</div>
          ) : null}
          {actions ? <div className="hidden items-center gap-3 sm:flex">{actions}</div> : null}
          {showDesktopAuthActions ? <DesktopAuthActions /> : null}
          <MobileNavigationMenu />
        </div>
      </div>
    </nav>
  );
}
