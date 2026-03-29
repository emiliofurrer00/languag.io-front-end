import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, X, Lightbulb, HelpCircle } from 'lucide-react';
import { NeoButton } from '@/components/ui/NeoButton';
import { StudyMultipleChoiceCard } from './types';

interface MultipleChoiceViewProps {
  card: StudyMultipleChoiceCard;
  colorClass: string;
  onAnswer: (correct: boolean) => void;
}

const optionLetters = ['A', 'B', 'C', 'D'];

const MultipleChoiceView = ({ card, colorClass, onAnswer }: MultipleChoiceViewProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex === null || hasAnswered) return;
    setHasAnswered(true);
  };

  const handleContinue = () => {
    const correct = selectedIndex === card.correctIndex;
    onAnswer(correct);
    setSelectedIndex(null);
    setHasAnswered(false);
  };

  const isCorrect = selectedIndex === card.correctIndex;

  return (
    <div className="w-full mb-8">
      {/* Question */}
      <div
        className={cn(
          'rounded-2xl border-[3px] border-foreground p-8 mb-6',
          'shadow-[6px_6px_0_0_hsl(var(--foreground))]',
          colorClass
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5" />
          <span className="px-3 py-1 bg-background/80 rounded-full text-xs font-semibold border-[2px] border-foreground">
            MULTIPLE CHOICE
          </span>
        </div>
        <p className="font-display font-bold text-2xl sm:text-3xl text-center">{card.question}</p>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {card.options.map((option: string, idx: number) => {
          const isSelected = selectedIndex === idx;
          const isCorrectOption = idx === card.correctIndex;

          let optionStyle = 'bg-card hover:bg-muted border-foreground';
          if (hasAnswered) {
            if (isCorrectOption) {
              optionStyle = 'bg-neo-teal border-foreground ring-2 ring-foreground';
            } else if (isSelected && !isCorrectOption) {
              optionStyle = 'bg-neo-coral border-foreground ring-2 ring-foreground';
            } else {
              optionStyle = 'bg-card border-foreground/40 opacity-50';
            }
          } else if (isSelected) {
            optionStyle = 'bg-primary/20 border-foreground ring-2 ring-primary';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={hasAnswered}
              className={cn(
                'flex items-center gap-4 w-full p-4 rounded-xl border-[3px] text-left transition-all',
                'shadow-[4px_4px_0_0_hsl(var(--foreground))]',
                !hasAnswered &&
                  !isSelected &&
                  'hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px]',
                hasAnswered && 'cursor-default',
                optionStyle
              )}
            >
              {/* Letter badge */}
              <span
                className={cn(
                  'w-10 h-10 rounded-lg border-[2px] border-foreground flex items-center justify-center font-display font-bold text-lg flex-shrink-0',
                  hasAnswered && isCorrectOption && 'bg-neo-teal',
                  hasAnswered && isSelected && !isCorrectOption && 'bg-neo-coral',
                  !hasAnswered && isSelected && 'bg-primary text-primary-foreground',
                  !hasAnswered && !isSelected && 'bg-background'
                )}
              >
                {hasAnswered && isCorrectOption ? (
                  <Check className="w-5 h-5" />
                ) : hasAnswered && isSelected && !isCorrectOption ? (
                  <X className="w-5 h-5" />
                ) : (
                  optionLetters[idx]
                )}
              </span>

              <span className="font-semibold text-lg">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback + explanation */}
      {hasAnswered && (
        <div
          className={cn(
            'mt-4 rounded-xl border-[3px] border-foreground p-4',
            'shadow-[4px_4px_0_0_hsl(var(--foreground))]',
            isCorrect ? 'bg-neo-teal' : 'bg-neo-coral'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <>
                <Check className="w-5 h-5" />
                <span className="font-display font-bold text-lg">Correct!</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5" />
                <span className="font-display font-bold text-lg">Not quite!</span>
              </>
            )}
          </div>
          {card.explanation && (
            <div className="flex items-start gap-2 mt-2">
              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{card.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Action button */}
      <div className="mt-6 flex justify-center">
        {!hasAnswered ? (
          <NeoButton
            variant="primary"
            onClick={handleConfirm}
            disabled={selectedIndex === null}
            className="min-w-[200px] disabled:opacity-40"
          >
            <Check className="w-5 h-5" />
            Check Answer
          </NeoButton>
        ) : (
          <NeoButton variant="primary" onClick={handleContinue} className="min-w-[200px]">
            Continue
          </NeoButton>
        )}
      </div>
    </div>
  );
};

export default MultipleChoiceView;
