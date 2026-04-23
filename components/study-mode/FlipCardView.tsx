import { cn } from '@/lib/utils';
import { StudyFlashCard } from './types';
import { Eye, EyeOff } from 'lucide-react';

interface FlipCardViewProps {
  card: StudyFlashCard;
  isFlipped: boolean;
  onFlip: () => void;
  colorClass: string;
}

const FlipCardView = ({ card, isFlipped, onFlip, colorClass }: FlipCardViewProps) => {
  return (
    <div
      className="perspective-1000 mb-8 w-full cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? 'Show the front of this card' : 'Reveal the answer'}
      onClick={onFlip}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onFlip();
        }
      }}
    >
      <div
        className={cn(
          'relative w-full min-h-[320px] sm:min-h-[380px] transition-transform duration-500 transform-style-3d',
          isFlipped && 'rotate-y-180'
        )}
      >
        {/* Front */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-2xl border-[3px] border-foreground p-8 flex flex-col items-center justify-center',
            'shadow-[6px_6px_0_0_hsl(var(--foreground))]',
            colorClass
          )}
        >
          <span className="px-3 py-1 bg-background/80 rounded-full text-xs font-semibold border-[2px] border-foreground mb-4">
            FRONT
          </span>
          <p className="font-display font-bold text-3xl sm:text-4xl text-center">
            {card.frontText}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-foreground/70">
            <Eye className="w-4 h-4" />
            <span>Tap to reveal</span>
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-[3px] border-foreground p-8 flex flex-col items-center justify-center',
            'shadow-[6px_6px_0_0_hsl(var(--foreground))] bg-card'
          )}
        >
          <span className="px-3 py-1 bg-primary/80 rounded-full text-xs font-semibold border-[2px] border-foreground mb-4">
            BACK
          </span>
          <p className="font-display font-bold text-3xl sm:text-4xl text-center">{card.backText}</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <EyeOff className="w-4 h-4" />
            <span>Tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCardView;
