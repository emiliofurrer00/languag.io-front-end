import { ArrowLeft, Brain, Check, RotateCcw, Shuffle } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import { Progress } from './Progress';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { StudyDeck } from './types';
import { MobileNavigationMenu } from '@/components/layout/MobileNavigationMenu';
import { buildProfilePath } from '@/lib/profile/paths';

export const colorMap: Record<string, string> = {
  magenta: 'bg-neo-magenta',
  teal: 'bg-neo-teal',
  blue: 'bg-neo-blue',
  coral: 'bg-neo-coral',
  yellow: 'bg-neo-yellow',
};

export default function Header({
  deck,
  currentIndex,
  totalCards,
  knownCards,
  learningCards,
  progressPercent,
  handleShuffle,
  handleRestart,
  backHref = '/decks',
  backLabel = 'Back',
}: {
  deck: StudyDeck;
  currentIndex: number;
  totalCards: number;
  knownCards: Set<string>;
  learningCards: Set<string>;
  progressPercent: number;
  handleShuffle: () => void;
  handleRestart: () => void;
  backHref?: string;
  backLabel?: string;
}) {
  const creatorUsername = deck.ownerUsername || deck.ownerName;
  const creatorProfilePath = buildProfilePath(creatorUsername);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b-[3px] border-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={backHref}>
              <NeoButton variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </NeoButton>
            </Link>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-[2px] border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                  colorMap[deck.color]
                )}
              />
              <div className="min-w-0">
                <span className="hidden truncate font-display text-lg font-bold sm:block">
                  {deck.title}
                </span>
                {creatorUsername ? (
                  creatorProfilePath ? (
                    <Link
                      href={creatorProfilePath}
                      className="block max-w-[9rem] truncate text-xs font-semibold text-muted-foreground underline-offset-2 hover:text-foreground hover:underline sm:max-w-[18rem]"
                    >
                      by @{creatorUsername}
                    </Link>
                  ) : (
                    <span className="block max-w-[9rem] truncate text-xs font-semibold text-muted-foreground sm:max-w-[18rem]">
                      by {creatorUsername}
                    </span>
                  )
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NeoButton variant="outline" size="sm" onClick={handleShuffle}>
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Shuffle</span>
            </NeoButton>
            <NeoButton variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Restart</span>
            </NeoButton>
            <MobileNavigationMenu />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5 text-sm">
            <span className="font-semibold">
              Card {currentIndex + 1} of {totalCards}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-foreground" />
                {knownCards.size}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Brain className="w-3.5 h-3.5 text-foreground" />
                {learningCards.size}
              </span>
            </div>
          </div>
          <Progress value={progressPercent} className="h-3 border-[2px] border-foreground" />
        </div>
      </div>
    </header>
  );
}
