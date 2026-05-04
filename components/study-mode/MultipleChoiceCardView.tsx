import type { MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import { Check, HelpCircle, Volume2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NeoButton } from '../ui/NeoButton';
import { StudyCard } from './types';

interface MultipleChoiceCardViewProps {
  card: StudyCard;
  colorClass: string;
  onAnswer: (wasCorrect: boolean) => void;
}

function getChoiceKey(choice: NonNullable<StudyCard['choices']>[number], index: number) {
  return choice.id ?? `${choice.order}-${index}-${choice.text}`;
}

export default function MultipleChoiceCardView({
  card,
  colorClass,
  onAnswer,
}: MultipleChoiceCardViewProps) {
  const choices = useMemo(
    () => [...(card.choices || [])].sort((a, b) => a.order - b.order),
    [card.choices]
  );
  const [selectedChoiceKey, setSelectedChoiceKey] = useState<string | null>(null);
  const selectedChoice = choices.find(
    (choice, index) => getChoiceKey(choice, index) === selectedChoiceKey
  );
  const correctChoice = choices.find((choice) => choice.isCorrect);
  const explanation = card.backText.trim();
  const hasExplanation = Boolean(explanation && explanation !== correctChoice?.text.trim());
  const hasFrontAudio = Boolean(card.frontAudioUrl);

  function playFrontAudio(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (!card.frontAudioUrl) {
      return;
    }

    void new Audio(card.frontAudioUrl).play();
  }

  return (
    <div className="mb-8 w-full rounded-2xl border-[3px] border-foreground bg-card p-5 shadow-[6px_6px_0_0_hsl(var(--foreground))] sm:p-7">
      <div
        className={cn(
          'mb-5 rounded-xl border-[3px] border-foreground p-5 shadow-[4px_4px_0_0_hsl(var(--foreground))]',
          colorClass
        )}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border-[2px] border-foreground bg-background/80 px-3 py-1 text-xs font-bold">
            <HelpCircle className="h-3.5 w-3.5" />
            Multiple Choice
          </span>
          {hasFrontAudio ? (
            <button
              type="button"
              onClick={playFrontAudio}
              aria-label="Play front-card audio"
              title="Play front-card audio"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border-[2px] border-foreground bg-background/80 shadow-[2px_2px_0_0_hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <p className="font-display text-2xl font-bold sm:text-3xl">{card.frontText}</p>
        {card.exampleSentence ? (
          <p className="mt-4 text-sm font-semibold text-foreground/75">{card.exampleSentence}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        {choices.map((choice, index) => {
          const choiceKey = getChoiceKey(choice, index);
          const isSelected = selectedChoiceKey === choiceKey;
          const showResult = Boolean(selectedChoiceKey);

          return (
            <button
              key={choiceKey}
              type="button"
              onClick={() => {
                if (!selectedChoiceKey) {
                  setSelectedChoiceKey(choiceKey);
                }
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border-[2px] border-foreground bg-background px-4 py-3 text-left font-semibold shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground',
                !selectedChoiceKey &&
                  'hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-muted hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]',
                showResult && choice.isCorrect && 'bg-neo-teal',
                showResult && isSelected && !choice.isCorrect && 'bg-neo-coral'
              )}
              disabled={Boolean(selectedChoiceKey)}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-card font-display text-xs font-bold">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">{choice.text}</span>
              {showResult && choice.isCorrect ? <Check className="h-5 w-5 shrink-0" /> : null}
              {showResult && isSelected && !choice.isCorrect ? (
                <X className="h-5 w-5 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedChoiceKey ? (
        <div className="mt-5 rounded-xl border-[2px] border-foreground bg-muted/70 p-4">
          <p className="font-display font-bold">
            {selectedChoice?.isCorrect
              ? 'Correct'
              : `Answer: ${correctChoice?.text ?? 'Not provided'}`}
          </p>
          {hasExplanation ? (
            <p className="mt-1 text-sm text-muted-foreground">{explanation}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex justify-end">
        <NeoButton
          variant="primary"
          onClick={() => selectedChoice && onAnswer(selectedChoice.isCorrect)}
          disabled={!selectedChoice}
        >
          Continue
          <Check className="h-4 w-4" />
        </NeoButton>
      </div>
    </div>
  );
}
