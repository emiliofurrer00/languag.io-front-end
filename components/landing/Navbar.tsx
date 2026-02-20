'use client';

import { Sparkles } from 'lucide-react';
import { NeoButton } from '@/components/ui/NeoButton';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary border-[2px] border-foreground flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))]">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl">Languag.io</span>
        </div>
        {/* Nav Links */}
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

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <NeoButton
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex cursor-pointer"
              >
                Log In
              </NeoButton>
            </SignInButton>
            <NeoButton variant="primary" size="sm" className="cursor-pointer">
              Get Started
            </NeoButton>
          </SignedOut>
          <SignedIn>
            <Link href="/decks" className="hidden sm:inline-flex">
              <NeoButton variant="outline" size="sm" className="cursor-pointer">
                My Decks
              </NeoButton>
            </Link>
            {/* For now just link to decks. Later on implement a profile page */}
            <Link href="/decks" className="hidden sm:inline-flex">
              <NeoButton variant="primary" size="sm" className="cursor-pointer">
                {`Hi, ${user?.firstName || 'User'}!`} 🤓
              </NeoButton>
            </Link>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
