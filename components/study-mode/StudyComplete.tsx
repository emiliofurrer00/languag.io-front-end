import {
  ArrowLeft,
  Brain,
  Check,
  LoaderCircle,
  RotateCcw,
  Shuffle,
  Trophy,
  UserPlus,
} from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import { Progress } from '@radix-ui/react-progress';
import { NeoCard } from '../ui/NeoCard';
import Link from 'next/link';
import { StudyDeck } from './types';
import { buildLoginRedirectPath } from '@/lib/auth-flow';
import { buildProfilePath } from '@/lib/profile/paths';

interface StudyCompleteProps {
  deck: StudyDeck;
  totalCards: number;
  knownCount: number;
  learningCount: number;
  isSubmitting: boolean;
  saveError: string | null;
  studySessionId?: string;
  sagaProgressSaved?: boolean;
  sagaId?: string;
  canSaveProgress?: boolean;
  backHref?: string;
  backLabel?: string;
  onRetrySave: () => void;
  onStudyLearning: () => void;
  onShuffle: () => void;
  onRestart: () => void;
}

const StudyComplete = ({
  deck,
  totalCards,
  knownCount,
  learningCount,
  isSubmitting,
  saveError,
  studySessionId,
  sagaProgressSaved,
  sagaId,
  canSaveProgress = true,
  backHref = '/decks',
  backLabel = 'Back',
  onRetrySave,
  onStudyLearning,
  onShuffle,
  onRestart,
}: StudyCompleteProps) => {
  const knownPercent = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0;
  const creatorUsername = deck.ownerUsername || deck.ownerName;
  const creatorProfilePath = buildProfilePath(creatorUsername);
  const loginHref = buildLoginRedirectPath(deck.id ? `/study/${deck.id}` : '/decks');

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b-[3px] border-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={backHref}>
            <NeoButton variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </NeoButton>
          </Link>
          <div className="min-w-0">
            <span className="block truncate font-display text-xl font-bold">{deck.title}</span>
            {creatorUsername ? (
              creatorProfilePath ? (
                <Link
                  href={creatorProfilePath}
                  className="block truncate text-xs font-semibold text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  by @{creatorUsername}
                </Link>
              ) : (
                <span className="block truncate text-xs font-semibold text-muted-foreground">
                  by {creatorUsername}
                </span>
              )
            ) : null}
          </div>
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

          {isSubmitting ? (
            <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-muted/60 px-4 py-3 text-sm">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Saving your study session...</span>
            </div>
          ) : null}

          {!isSubmitting && studySessionId ? (
            <div className="mb-6 rounded-xl border-[2px] border-foreground bg-neo-teal/40 px-4 py-3 text-sm">
              {sagaProgressSaved
                ? 'Your study session and saga progress have been saved.'
                : 'Your study session has been saved.'}
            </div>
          ) : null}

          {!canSaveProgress ? (
            <div className="mb-6 rounded-xl border-[2px] border-foreground bg-neo-yellow/40 px-4 py-3 text-sm">
              <p>Your preview run is complete. Sign in to save history and due-card progress.</p>
              <div className="mt-3 flex justify-center">
                <Link href={loginHref}>
                  <NeoButton variant="outline" size="sm">
                    <UserPlus className="h-4 w-4" />
                    Sign in to save
                  </NeoButton>
                </Link>
              </div>
            </div>
          ) : null}

          {saveError ? (
            <div className="mb-6 rounded-xl border-[2px] border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <p>{saveError}</p>
              <div className="mt-3 flex justify-center">
                <NeoButton variant="outline" size="sm" onClick={onRetrySave}>
                  Retry Save
                </NeoButton>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {sagaId ? (
              <Link href={`/sagas/${sagaId}`}>
                <NeoButton variant="outline">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Saga
                </NeoButton>
              </Link>
            ) : null}
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
