import { SocialNavActions } from '@/components/social/SocialNavActions';
import { Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Go to home"
              className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-foreground bg-primary shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Sparkles className="h-5 w-5" />
            </Link>
            <span className="font-display font-bold md:text-xl">My Decks</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SocialNavActions />
          <Link
            href="/decks/editor/new"
            className="inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-primary px-3 py-2 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Deck</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
