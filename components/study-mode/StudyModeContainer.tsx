'use client';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DeckDetails } from '@/lib/decks/types';
import { NeoButton } from '../ui/NeoButton';
import FlipCardView from './FlipCardView';
import Header, { colorMap } from './Header';
import StudyComplete from './StudyComplete';
import MultipleChoiceView from './MultiChoiceCard';
import {
  isMultipleChoiceCard,
  StudyCard,
  StudyDeck,
  StudyFlashCard,
  StudyMultipleChoiceCard,
} from './types';

const mockMCQ: StudyMultipleChoiceCard = {
  id: '5',
  type: 'multiple-choice',
  question: "How do you say 'Good morning' in Spanish?",
  options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Buen provecho'],
  correctIndex: 1,
  explanation: "'Buenos días' literally means 'Good days' and is used as a morning greeting.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockConversation: StudyMultipleChoiceCard = {
  id: '6',
  type: 'multiple-choice',
  question: 'What do you feel like ordering for dinner?',
  options: ['Steak', 'RIP my granny', 'Carbonara', 'Culito'],
  correctIndex: 1,
  explanation: "'Buenos días' literally means 'Good days' and is used as a morning greeting.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

function normalizeStudyDeck(deck: DeckDetails): StudyDeck {
  const normalizedCards: StudyFlashCard[] = deck.cards.map((card, index) => ({
    id: `${deck.id ?? 'deck'}-flash-${index}`,
    frontText: card.frontText,
    backText: card.backText,
  }));

  return {
    ...deck,
    cards: [...normalizedCards, mockMCQ, mockConversation],
  };
}

export default function StudyModeContainer({ mockDeck }: { mockDeck: DeckDetails }) {
  const deck = normalizeStudyDeck(mockDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [learningCards, setLearningCards] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<StudyCard[]>(deck.cards);

  const currentCard = shuffledCards[currentIndex];
  const totalCards = shuffledCards.length;
  const reviewedCount = knownCards.size + learningCards.size;
  const progressPercent = totalCards > 0 ? (reviewedCount / totalCards) * 100 : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const goToNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, totalCards]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const markAsKnown = useCallback(() => {
    setKnownCards((prev) => new Set(prev).add(currentCard.id));
    setLearningCards((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    goToNext();
  }, [currentCard, goToNext]);

  const markAsLearning = useCallback(() => {
    setLearningCards((prev) => new Set(prev).add(currentCard.id));
    setKnownCards((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    goToNext();
  }, [currentCard, goToNext]);

  const handleMCQAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        markAsKnown();
      } else {
        markAsLearning();
      }
    },
    [markAsKnown, markAsLearning]
  );

  const handleShuffle = useCallback(() => {
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setLearningCards(new Set());
    setIsComplete(false);
  }, [deck.cards]);

  const handleRestart = useCallback(() => {
    setShuffledCards([...deck.cards]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setLearningCards(new Set());
    setIsComplete(false);
  }, [deck.cards]);

  const handleStudyLearning = useCallback(() => {
    const cardsToStudy = shuffledCards.filter((c) => learningCards.has(c.id));
    if (cardsToStudy.length > 0) {
      setShuffledCards(cardsToStudy);
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownCards(new Set());
      setLearningCards(new Set());
      setIsComplete(false);
    }
  }, [shuffledCards, learningCards]);

  // Keyboard shortcuts (only for flip cards)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;
      if (true) {
        switch (e.key) {
          case ' ':
            e.preventDefault();
            handleFlip();
            break;
          case 'ArrowLeft':
            goToPrev();
            break;
          case 'ArrowRight':
            goToNext();
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete, handleFlip, goToPrev, goToNext, currentCard]);

  if (isComplete) {
    return (
      <StudyComplete
        deck={deck}
        totalCards={totalCards}
        knownCount={knownCards.size}
        learningCount={learningCards.size}
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
      {/* Card Area */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center max-w-2xl">
        {/* Render based on card type */}
        {!isMultipleChoiceCard(currentCard) ? (
          <>
            <FlipCardView
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              colorClass={`bg-neo-${deck.color}`}
            />

            {/* Action Buttons for flip cards */}
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

              <NeoButton
                variant="accent"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsLearning();
                }}
                className="flex-1 mdmax-w-[180px]"
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
          </>
        ) : (
          <MultipleChoiceView
            key={currentCard.id}
            card={currentCard}
            colorClass={colorMap[deck.color]}
            onAnswer={handleMCQAnswer}
          />
        )}

        {/* Card indicator dots */}
        <div className="mt-6 flex items-center gap-1.5 flex-wrap justify-center max-w-md">
          {shuffledCards.map((card, idx) => (
            <button
              key={card.id}
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

        {/* Keyboard hint - only for flip cards */}
        {true && (
          <p className="mt-4 text-xs text-muted-foreground text-center hidden sm:block">
            Use{' '}
            <kbd className="px-1.5 py-0.5 rounded border-[1px] border-foreground bg-muted font-mono text-[10px]">
              Space
            </kbd>{' '}
            to flip ·{' '}
            <kbd className="px-1.5 py-0.5 rounded border-[1px] border-foreground bg-muted font-mono text-[10px]">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded border-[1px] border-foreground bg-muted font-mono text-[10px]">
              →
            </kbd>{' '}
            to navigate
          </p>
        )}
      </main>
    </div>
  );
}
