import { ArrowLeft, RotateCcw, Shuffle, Trophy, Check, Brain } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import { Progress } from '@radix-ui/react-progress';
import { NeoCard } from '../ui/NeoCard';
import Link from 'next/link';
import { StudyDeck } from './types';

interface StudyCompleteProps {
  deck: StudyDeck;
  totalCards: number;
  knownCount: number;
  learningCount: number;
  onStudyLearning: () => void;
  onShuffle: () => void;
  onRestart: () => void;
}

const StudyComplete = ({
  deck,
  totalCards,
  knownCount,
  learningCount,
  onStudyLearning,
  onShuffle,
  onRestart,
}: StudyCompleteProps) => {
  const knownPercent = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b-[3px] border-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/decks">
            <NeoButton variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </NeoButton>
          </Link>
          <span className="font-display font-bold text-xl">{deck.title}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <NeoCard className="text-center p-10">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neo-yellow border-[3px] border-foreground flex items-center justify-center shadow-[4px_4px_0_0_hsl(var(--foreground))]">
            <Trophy className="w-12 h-12" />
          </div>

          <h2 className="font-display font-bold text-3xl mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-8">
            You&apos;ve reviewed all {totalCards} cards in this deck
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <NeoCard variant="teal" size="sm" className="p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Check className="w-5 h-5" />
                <span className="font-display font-bold text-2xl">{knownCount}</span>
              </div>
              <p className="text-sm font-semibold">I Know This</p>
            </NeoCard>

            <NeoCard variant="coral" size="sm" className="p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Brain className="w-5 h-5" />
                <span className="font-display font-bold text-2xl">{learningCount}</span>
              </div>
              <p className="text-sm font-semibold">Still Learning</p>
            </NeoCard>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Mastery</span>
              <span className="text-sm font-bold font-display">{knownPercent}%</span>
            </div>
            <Progress value={knownPercent} className="h-4 border-[2px] border-foreground" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {learningCount > 0 && (
              <NeoButton variant="accent" onClick={onStudyLearning}>
                <Brain className="w-4 h-4" />
                Study {learningCount} Again
              </NeoButton>
            )}
            <NeoButton variant="primary" onClick={onShuffle}>
              <Shuffle className="w-4 h-4" />
              Shuffle & Restart
            </NeoButton>
            <NeoButton variant="secondary" onClick={onRestart}>
              <RotateCcw className="w-4 h-4" />
              Restart
            </NeoButton>
          </div>
        </NeoCard>
      </main>
    </div>
  );
};

export default StudyComplete;
