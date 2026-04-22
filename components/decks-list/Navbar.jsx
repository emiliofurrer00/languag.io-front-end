import { SocialNavActions } from '@/components/social/SocialNavActions';
import { Sparkles, Plus } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-3">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary border-[2px] border-foreground flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              <Link href="/">
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
            <span className="font-display font-bold text-xl">My Decks</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <SocialNavActions />
          <Link href={'/decks/editor/new'}>
            <NeoButton variant="primary" className="cursor-pointer">
              <Plus className="w-4 h-4" />
              Create Deck
            </NeoButton>
          </Link>
        </div>
      </div>
    </nav>
  );
}
