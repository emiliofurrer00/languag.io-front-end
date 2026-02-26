import { Sparkles, ArrowLeft, Save } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import Link from 'next/link';

export default function Navbar({ deckName, deckColor }: { deckName: string; deckColor: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-3">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-6">
          <Link href="/decks">
            <NeoButton variant="secondary" className="py-2 px-4 text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Back
            </NeoButton>
          </Link>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full bg-neo-${deckColor} border-2 border-foreground flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))]`}
            ></div>
            <span className="font-display font-bold text-xl">{deckName}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <NeoButton variant="secondary" className="cursor-pointer" size="sm">
            {/* <Save className="w-4 h-4" /> */}
            Shuffle
          </NeoButton>
          <NeoButton variant="secondary" className="cursor-pointer" size="sm">
            {/* <Save className="w-4 h-4" /> */}
            Restart
          </NeoButton>
        </div>
      </div>
    </nav>
  );
}
