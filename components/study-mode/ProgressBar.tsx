import { Brain, Check } from 'lucide-react';
import { Progress } from './Progress';

export default function ProgressBar({
  currentIndex,
  totalCards,
  knownCards,
  learningCards,
  progressPercent,
}: {
  currentIndex: number;
  totalCards: number;
  knownCards: Set<string>;
  learningCards: Set<string>;
  progressPercent: number;
}) {
  return (
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
  );
}
