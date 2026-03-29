import { ArrowLeft, Brain, Check, RotateCcw, Shuffle } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import { Progress } from './Progress';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { StudyDeck } from './types';

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
}: {
  deck: StudyDeck;
  currentIndex: number;
  totalCards: number;
  knownCards: Set<string>;
  learningCards: Set<string>;
  progressPercent: number;
  handleShuffle: () => void;
  handleRestart: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b-[3px] border-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/decks">
              <NeoButton variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </NeoButton>
            </Link>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-[2px] border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                  colorMap[deck.color]
                )}
              />
              <span className="font-display font-bold text-lg hidden sm:inline">{deck.title}</span>
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
