import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { StudyCard } from './types';
import { Clock, Eye, EyeOff, RotateCcw, Sparkles, Target, Volume2 } from 'lucide-react';

interface FlipCardViewProps {
  card: StudyCard;
  isFlipped: boolean;
  onFlip: () => void;
  colorClass: string;
}

const reasonStyles = {
  Due: 'bg-neo-yellow',
  Lapsed: 'bg-neo-coral',
  New: 'bg-neo-teal',
  Review: 'bg-secondary',
};

const reasonIcons = {
  Due: Clock,
  Lapsed: RotateCcw,
  New: Sparkles,
  Review: Target,
};

const FlipCardView = ({ card, isFlipped, onFlip, colorClass }: FlipCardViewProps) => {
  const ReasonIcon = card.reason ? reasonIcons[card.reason] : null;
  const hasFrontAudio = Boolean(card.frontAudioUrl);

  function playFrontAudio(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (!card.frontAudioUrl) {
      return;
    }

    void new Audio(card.frontAudioUrl).play();
  }

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
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1 bg-background/80 rounded-full text-xs font-semibold border-[2px] border-foreground">
              FRONT
            </span>
            {hasFrontAudio ? (
              <button
                type="button"
                onClick={playFrontAudio}
                onKeyDown={(event) => event.stopPropagation()}
                aria-label="Play front-card audio"
                title="Play front-card audio"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-[2px] border-foreground bg-background/80 shadow-[2px_2px_0_0_hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            ) : null}
            {card.reason && ReasonIcon ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border-[2px] border-foreground px-3 py-1 text-xs font-semibold',
                  reasonStyles[card.reason]
                )}
              >
                <ReasonIcon className="h-3.5 w-3.5" />
                {card.reason}
              </span>
            ) : null}
          </div>
          <p className="font-display font-bold text-3xl sm:text-4xl text-center">
            {card.frontText}
          </p>
          {typeof card.accuracy === 'number' && card.totalReviews !== 0 ? (
            <span className="mt-4 rounded-full border-[2px] border-foreground bg-background/70 px-3 py-1 text-xs font-semibold">
              {Math.round(card.accuracy)}% accuracy
            </span>
          ) : null}
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
          {card.exampleSentence ? (
            <p className="mt-5 max-w-md text-center text-sm text-muted-foreground">
              {card.exampleSentence}
            </p>
          ) : null}
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
