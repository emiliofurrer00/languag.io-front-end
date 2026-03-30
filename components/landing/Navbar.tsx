'use client';

import {
  useKindeBrowserClient,
} from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { cn } from '@/lib/utils';
import { NeoButton } from '@/components/ui/NeoButton';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const displayName = user?.given_name || user?.family_name || user?.email || 'User';
  const authButtonClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground font-semibold transition-all font-display',
    'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
    'px-4 py-2 text-sm'
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary border-[2px] border-foreground flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))]">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl">Languag.io</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="font-medium hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="font-medium hover:text-primary transition-colors">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <>
              <NeoButton
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex cursor-progress"
                type="button"
                disabled
              >
                Loading...
              </NeoButton>
              <NeoButton variant="primary" size="sm" className="cursor-progress" type="button" disabled>
                Please wait
              </NeoButton>
            </>
          ) : null}

          {!isLoading && !isAuthenticated ? (
            <>
              <LoginLink
                postLoginRedirectURL="/decks"
                className={cn(
                  authButtonClassName,
                  'hidden sm:inline-flex cursor-pointer bg-transparent text-foreground hover:bg-muted'
                )}
              >
                Log In
              </LoginLink>
              <RegisterLink
                postLoginRedirectURL="/decks"
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
              <Link href="/decks" className="hidden sm:inline-flex">
                <NeoButton variant="primary" size="sm" className="cursor-pointer">
                  {`Hi, ${displayName}!`}
                </NeoButton>
              </Link>
              <LogoutLink
                postLogoutRedirectURL="/"
                className={cn(
                  authButtonClassName,
                  'hidden sm:inline-flex cursor-pointer bg-transparent text-foreground hover:bg-muted'
                )}
              >
                Log Out
              </LogoutLink>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
