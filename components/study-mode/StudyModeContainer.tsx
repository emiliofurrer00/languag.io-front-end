'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { submitStudySession } from '@/lib/decks/client';
import { completeSagaLesson } from '@/lib/sagas/client';
import { DeckDetails } from '@/lib/decks/types';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import FlipCardView from './FlipCardView';
import Header, { colorMap } from './Header';
import MultipleChoiceCardView from './MultipleChoiceCardView';
import StudyComplete from './StudyComplete';
import { NeoButton } from '../ui/NeoButton';
import { NeoCard } from '../ui/NeoCard';
import { isMultipleChoiceCard, StudyCard, StudyDeck, StudySessionResponse } from './types';

type SubmissionState = {
  isSubmitting: boolean;
  error: string | null;
  studySessionId?: string;
  sagaProgressSaved?: boolean;
};

type SagaStudyContext = {
  sagaId: string;
  lessonId: string;
};

function normalizeStudyDeck(deck: DeckDetails): StudyDeck {
  const normalizedCards: StudyCard[] = (deck.cards || []).flatMap((card) =>
    card.id
      ? [
          {
            id: card.id,
            type: card.type ?? 'flashcard',
            frontText: card.frontText,
            backText: card.backText,
            frontAudioAssetId: card.frontAudioAssetId,
            frontAudioUrl: card.frontAudioUrl,
            frontAudioStatus: card.frontAudioStatus,
            order: card.order,
            exampleSentence: card.exampleSentence,
            choices: card.choices ?? [],
            isNew: card.isNew,
            isDue: card.isDue,
            dueAtUtc: card.dueAtUtc,
            intervalDays: card.intervalDays,
            accuracy: card.accuracy,
            totalReviews: card.totalReviews,
            reason: card.reason,
          },
        ]
      : []
  );

  return {
    ...deck,
    id: deck.id ?? '',
    cards: normalizedCards,
  };
}

function findNextUnansweredCardIndex(
  cards: StudyCard[],
  results: Record<string, boolean>,
  currentIndex: number
) {
  for (let offset = 1; offset <= cards.length; offset += 1) {
    const nextIndex = (currentIndex + offset) % cards.length;
    if (results[cards[nextIndex].id] === undefined) {
      return nextIndex;
    }
  }

  return currentIndex;
}

function buildSessionResponses(
  cards: StudyCard[],
  results: Record<string, boolean>
): StudySessionResponse[] {
  return cards.flatMap((card) =>
    results[card.id] === undefined
      ? []
      : [
          {
            cardId: card.id,
            wasCorrect: results[card.id],
          },
        ]
  );
}

function getSubmissionErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'Unable to save your study session.';
  }

  const prefix = 'API request failed for';
  if (!error.message.startsWith(prefix)) {
    return error.message;
  }

  const messageParts = error.message.split(': ');
  return messageParts[messageParts.length - 1] || 'Unable to save your study session.';
}

export default function StudyModeContainer({
  mockDeck,
  sagaContext,
}: {
  mockDeck: DeckDetails;
  sagaContext?: SagaStudyContext;
}) {
  const deck = normalizeStudyDeck(mockDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<StudyCard[]>(deck.cards);
  const [cardResults, setCardResults] = useState<Record<string, boolean>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    error: null,
  });
  const sessionVersionRef = useRef(0);

  const currentCard = shuffledCards[currentIndex] ?? null;
  const totalCards = shuffledCards.length;
  const knownCards = new Set(
    Object.entries(cardResults)
      .filter(([, wasCorrect]) => wasCorrect)
      .map(([cardId]) => cardId)
  );
  const learningCards = new Set(
    Object.entries(cardResults)
      .filter(([, wasCorrect]) => !wasCorrect)
      .map(([cardId]) => cardId)
  );
  const reviewedCount = Object.keys(cardResults).length;
  const progressPercent = totalCards > 0 ? (reviewedCount / totalCards) * 100 : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const goToNext = useCallback(() => {
    if (totalCards === 0 || currentIndex >= totalCards - 1) {
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
  }, [currentIndex, totalCards]);

  const goToPrev = useCallback(() => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((prev) => prev - 1);
    setIsFlipped(false);
  }, [currentIndex]);

  const resetSession = useCallback((nextCards: StudyCard[]) => {
    sessionVersionRef.current += 1;
    setShuffledCards(nextCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCardResults({});
    setIsComplete(false);
    setSubmissionState({
      isSubmitting: false,
      error: null,
    });
  }, []);

  const submitCurrentSession = useCallback(
    async (results: Record<string, boolean>) => {
      const activeSessionVersion = sessionVersionRef.current;
      const responses = buildSessionResponses(shuffledCards, results);

      if (!deck.id) {
        setSubmissionState({
          isSubmitting: false,
          error: 'This deck is missing an id, so the study session could not be saved.',
        });
        return;
      }

      if (responses.length === 0) {
        setSubmissionState({
          isSubmitting: false,
          error: 'Answer at least one card before submitting your study session.',
        });
        return;
      }

      const correctCount = responses.filter((response) => response.wasCorrect).length;
      const percentageCorrect = Math.round((correctCount / responses.length) * 100);

      setSubmissionState({
        isSubmitting: true,
        error: null,
      });

      try {
        const result = await submitStudySession({
          deckId: deck.id,
          percentageCorrect,
          responses,
        });

        if (sagaContext) {
          await completeSagaLesson(sagaContext.sagaId, sagaContext.lessonId);
        }

        if (activeSessionVersion !== sessionVersionRef.current) {
          return;
        }

        setSubmissionState({
          isSubmitting: false,
          error: null,
          studySessionId: result.studySessionId,
          sagaProgressSaved: Boolean(sagaContext),
        });
      } catch (error) {
        if (activeSessionVersion !== sessionVersionRef.current) {
          return;
        }

        setSubmissionState({
          isSubmitting: false,
          error: getSubmissionErrorMessage(error),
        });
      }
    },
    [deck.id, sagaContext, shuffledCards]
  );

  const markCard = useCallback(
    (wasCorrect: boolean) => {
      if (!currentCard) {
        return;
      }

      const nextResults = {
        ...cardResults,
        [currentCard.id]: wasCorrect,
      };

      setCardResults(nextResults);
      setIsFlipped(false);

      if (Object.keys(nextResults).length >= totalCards) {
        setIsComplete(true);
        void submitCurrentSession(nextResults);
        return;
      }

      setCurrentIndex(findNextUnansweredCardIndex(shuffledCards, nextResults, currentIndex));
    },
    [cardResults, currentCard, currentIndex, shuffledCards, submitCurrentSession, totalCards]
  );

  const markAsKnown = useCallback(() => {
    markCard(true);
  }, [markCard]);

  const markAsLearning = useCallback(() => {
    markCard(false);
  }, [markCard]);

  const handleShuffle = useCallback(() => {
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
    resetSession(shuffled);
  }, [deck.cards, resetSession]);

  const handleRestart = useCallback(() => {
    resetSession([...deck.cards]);
  }, [deck.cards, resetSession]);

  const handleStudyLearning = useCallback(() => {
    const cardsToStudy = shuffledCards.filter((card) => cardResults[card.id] === false);
    if (cardsToStudy.length > 0) {
      resetSession(cardsToStudy);
    }
  }, [cardResults, resetSession, shuffledCards]);

  const handleRetrySave = useCallback(() => {
    void submitCurrentSession(cardResults);
  }, [cardResults, submitCurrentSession]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete || !currentCard) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (!isMultipleChoiceCard(currentCard)) {
            handleFlip();
          }
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, goToNext, goToPrev, handleFlip, isComplete]);

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-xl">
          <NeoCard className="p-8 text-center">
            <h1 className="font-display text-2xl font-bold">No cards to study yet</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Add some cards to this deck before starting a study session.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/decks">
                <NeoButton variant="outline">Back to Decks</NeoButton>
              </Link>
            </div>
          </NeoCard>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <StudyComplete
        deck={deck}
        totalCards={totalCards}
        knownCount={knownCards.size}
        learningCount={learningCards.size}
        isSubmitting={submissionState.isSubmitting}
        saveError={submissionState.error}
        studySessionId={submissionState.studySessionId}
        sagaProgressSaved={submissionState.sagaProgressSaved}
        sagaId={sagaContext?.sagaId}
        onRetrySave={handleRetrySave}
        onStudyLearning={handleStudyLearning}
        onShuffle={handleShuffle}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="md:min-h-screen bg-background flex flex-col">
      <Header
        deck={deck}
        currentIndex={currentIndex}
        totalCards={totalCards}
        knownCards={knownCards}
        learningCards={learningCards}
        progressPercent={progressPercent}
        handleShuffle={handleShuffle}
        handleRestart={handleRestart}
      />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center max-w-2xl">
        {isMultipleChoiceCard(currentCard) ? (
          <MultipleChoiceCardView
            key={currentCard.id}
            card={currentCard}
            colorClass={colorMap[deck.color] || 'bg-neo-teal'}
            onAnswer={markCard}
          />
        ) : (
          <FlipCardView
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            colorClass={colorMap[deck.color] || 'bg-neo-teal'}
          />
        )}

        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
          <NeoButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            disabled={currentIndex === 0}
            className="disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </NeoButton>

          {!isMultipleChoiceCard(currentCard) ? (
            <>
              <NeoButton
                variant="accent"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsLearning();
                }}
                className="flex-1 md:max-w-[180px]"
              >
                <X className="w-3 h-3 md:w-5 md:h-5" />
                Still Learning
              </NeoButton>

              <NeoButton
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsKnown();
                }}
                className="flex-1 max-w-[180px]"
              >
                <Check className="w-3 h-3 md:w-5 md:h-5" />I Know This
              </NeoButton>
            </>
          ) : null}

          <NeoButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            disabled={currentIndex === totalCards - 1}
            className="disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </NeoButton>
        </div>

        <div className="mt-6 flex items-center gap-1.5 flex-wrap justify-center max-w-md">
          {shuffledCards.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              aria-label={`Go to card ${idx + 1}`}
              onClick={() => {
                setCurrentIndex(idx);
                setIsFlipped(false);
              }}
              className={cn(
                'w-3 h-3 rounded-full border-[2px] border-foreground transition-all',
                idx === currentIndex && 'scale-125 bg-primary',
                idx !== currentIndex && knownCards.has(card.id) && 'bg-neo-teal',
                idx !== currentIndex && learningCards.has(card.id) && 'bg-neo-coral',
                idx !== currentIndex &&
                  !knownCards.has(card.id) &&
                  !learningCards.has(card.id) &&
                  'bg-muted'
              )}
            />
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center hidden sm:block">
          Use{' '}
          <kbd className="px-1.5 py-0.5 rounded border-[1px] border-foreground bg-muted font-mono text-[10px]">
            Space
          </kbd>{' '}
          to flip and the arrow keys to navigate.
        </p>
      </main>
    </div>
  );
}
