'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Globe2,
  Languages,
  Loader2,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Wand2,
} from 'lucide-react';

import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { toast } from '@/hooks/useToast';
import { getApiErrorDisplayMessage } from '@/lib/api';
import {
  createAiDeckGenerationJob,
  createDeck,
  getAiDeckGenerationJob,
  getDeckStudyPlan,
  submitStudySession,
  type CreatedDeckResult,
} from '@/lib/decks/client';
import type { DeckDetails, StudyPlanCard } from '@/lib/decks/types';
import {
  STARTER_DECKS,
  type StarterDeck,
  type StarterDeckIcon,
} from '@/lib/get-started/starter-decks';
import { getNeoColorClass } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';

type StepKey = 'pick' | 'study' | 'save';
type BusyKind = 'starter' | 'ai' | null;
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type FirstSessionCard = {
  id: string;
  deckVersionId?: string;
  deckVersionNumber?: number;
  frontText: string;
  backText: string;
};

type FirstSessionDeck = {
  id: string;
  title: string;
  topic: string;
  description?: string | null;
  color: string;
  deckVersionId?: string;
  cards: FirstSessionCard[];
};

type GetStartedFlowProps = {
  firstName: string;
  dailyGoal: number;
  nextPath: string;
};

const STEPS: Array<{ key: StepKey; label: string; icon: typeof BookOpen }> = [
  { key: 'pick', label: 'Pick a deck', icon: BookOpen },
  { key: 'study', label: 'Study 5 cards', icon: Target },
  { key: 'save', label: 'Save progress', icon: Flame },
];

const starterIconMap: Record<StarterDeckIcon, typeof BookOpen> = {
  language: Languages,
  world: Globe2,
  brain: Brain,
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function buildStarterDeckDetails(deck: StarterDeck): DeckDetails {
  return {
    title: deck.title,
    description: deck.description,
    category: deck.topic,
    color: deck.color,
    visibility: 0,
    cards: deck.cards.map((card, index) => ({
      type: 'flashcard',
      frontText: card.front,
      backText: card.back,
      order: index,
    })),
  };
}

function buildPromptFromOnboardingSeed(value: unknown) {
  if (!value || typeof value !== 'object') {
    return '';
  }

  const record = value as Record<string, unknown>;
  const goals = Array.isArray(record.goals)
    ? record.goals.filter(
        (goal): goal is string => typeof goal === 'string' && goal.trim().length > 0
      )
    : [];
  const topic =
    goals[0] ||
    (typeof record.goal === 'string' ? record.goal : '') ||
    (typeof record.targetLanguage === 'string' ? `${record.targetLanguage} basics` : '') ||
    (typeof record.tagline === 'string' ? record.tagline : '') ||
    (typeof record.aboutMe === 'string' ? record.aboutMe : '');

  const prompt = topic.trim() ? `5 beginner cards about ${topic.trim()}` : '';

  return prompt.slice(0, 180);
}

function cardFromStudyPlan(card: StudyPlanCard): FirstSessionCard {
  return {
    id: card.cardId,
    deckVersionId: card.deckVersionId,
    deckVersionNumber: card.deckVersionNumber,
    frontText: card.frontText,
    backText: card.backText,
  };
}

function cardsFromCreatedDeck(deck: CreatedDeckResult): FirstSessionCard[] {
  return (deck.cards || []).flatMap((card) =>
    card.id
      ? [
          {
            id: card.id,
            deckVersionId: card.deckVersionId,
            deckVersionNumber: card.deckVersionNumber,
            frontText: card.frontText,
            backText: card.backText,
          },
        ]
      : []
  );
}

function getKnownCount(results: Record<string, boolean>) {
  return Object.values(results).filter(Boolean).length;
}

function normalizeGeneratedTitle(prompt: string) {
  const topic = prompt
    .replace(/^\d+\s*(beginner|easy|intro)?\s*cards?\s*(about|on)?\s*/i, '')
    .trim();

  if (!topic) {
    return 'AI Starter Deck';
  }

  return topic.charAt(0).toUpperCase() + topic.slice(1);
}

export default function GetStartedFlow({ firstName, dailyGoal, nextPath }: GetStartedFlowProps) {
  const router = useRouter();
  const requestVersionRef = useRef(0);
  const [step, setStep] = useState<StepKey>('pick');
  const [activeDeck, setActiveDeck] = useState<FirstSessionDeck | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [busyKind, setBusyKind] = useState<BusyKind>(null);
  const [busyDeckId, setBusyDeckId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const [flowError, setFlowError] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardResults, setCardResults] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [studySessionId, setStudySessionId] = useState<string | null>(null);

  const stepIndex = STEPS.findIndex((item) => item.key === step);
  const isBusy = busyKind !== null;
  const studiedCount = activeDeck ? Object.keys(cardResults).length : 0;
  const knownCount = getKnownCount(cardResults);
  const dailyGoalProgress = Math.min(dailyGoal, activeDeck?.cards.length ?? 5);
  const progressPct =
    step === 'save' && saveStatus === 'saved'
      ? 100
      : ((stepIndex + (step === 'save' ? 0.65 : 0.2)) / STEPS.length) * 100;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('onboarding:first-session-seed');
      const prompt = raw ? buildPromptFromOnboardingSeed(JSON.parse(raw)) : '';

      if (prompt) {
        setAiPrompt(prompt);
      }
    } catch {
      // Local seed data is an enhancement only.
    }

    return () => {
      requestVersionRef.current += 1;
    };
  }, []);

  const currentCard = activeDeck?.cards[cardIndex] ?? null;

  const starterDeckCards = useMemo(
    () =>
      STARTER_DECKS.map((deck) => ({
        ...deck,
        Icon: starterIconMap[deck.icon],
      })),
    []
  );

  async function prepareStudyDeck(
    createdDeck: CreatedDeckResult,
    fallback: Pick<FirstSessionDeck, 'title' | 'topic' | 'description' | 'color'>
  ) {
    const studyPlan = await getDeckStudyPlan(createdDeck.id, 5);
    const plannedCards = studyPlan.slice(0, 5).map(cardFromStudyPlan);
    const createdCards = cardsFromCreatedDeck(createdDeck).slice(0, 5);
    const cards = plannedCards.length > 0 ? plannedCards : createdCards;

    if (cards.length === 0) {
      throw new Error('The deck was created, but no study-ready cards were returned.');
    }

    return {
      id: createdDeck.id,
      title: createdDeck.title || fallback.title,
      topic: createdDeck.category || fallback.topic,
      description: createdDeck.description || fallback.description,
      color: createdDeck.color || fallback.color,
      deckVersionId: cards[0]?.deckVersionId ?? createdDeck.deckVersionId,
      cards,
    };
  }

  function beginRequest(kind: BusyKind, deckId?: string) {
    requestVersionRef.current += 1;
    setBusyKind(kind);
    setBusyDeckId(deckId ?? null);
    setFlowError(null);
    setStatusText(kind === 'ai' ? 'Starting the generator...' : 'Saving a starter copy...');

    return requestVersionRef.current;
  }

  function finishRequest(version: number) {
    if (requestVersionRef.current !== version) {
      return;
    }

    setBusyKind(null);
    setBusyDeckId(null);
    setStatusText('');
  }

  function startStudy(deck: FirstSessionDeck) {
    setActiveDeck(deck);
    setCardIndex(0);
    setIsFlipped(false);
    setCardResults({});
    setSaveStatus('idle');
    setSaveError(null);
    setStudySessionId(null);
    setStep('study');
  }

  async function handlePickStarter(deck: StarterDeck) {
    if (isBusy) {
      return;
    }

    const requestVersion = beginRequest('starter', deck.id);

    try {
      const createdDeck = await createDeck(buildStarterDeckDetails(deck));

      if (requestVersionRef.current !== requestVersion) {
        return;
      }

      const studyDeck = await prepareStudyDeck(createdDeck, {
        title: deck.title,
        topic: deck.topic,
        description: deck.description,
        color: deck.color,
      });

      if (requestVersionRef.current !== requestVersion) {
        return;
      }

      startStudy(studyDeck);
      toast({
        title: 'Deck ready',
        description: 'Your five-card starter is saved and ready to study.',
      });
    } catch (error) {
      if (requestVersionRef.current === requestVersion) {
        setFlowError(getApiErrorDisplayMessage(error, 'Unable to prepare that starter deck.'));
      }
    } finally {
      finishRequest(requestVersion);
    }
  }

  async function waitForGeneratedDeck(jobId: string, requestVersion: number) {
    for (let attempt = 0; attempt < 45; attempt += 1) {
      if (requestVersionRef.current !== requestVersion) {
        throw new Error('Deck generation was cancelled.');
      }

      const job = await getAiDeckGenerationJob(jobId);

      if (job.status === 'Completed' && job.createdDeckId) {
        return job.createdDeckId;
      }

      if (job.status === 'Failed') {
        throw new Error(job.errorMessage || 'Deck generation failed. Try a narrower topic.');
      }

      setStatusText(job.status === 'Processing' ? 'Building 5 cards...' : 'Waiting for worker...');
      await sleep(1800);
    }

    throw new Error('Deck generation is taking longer than expected. Try again in a moment.');
  }

  async function handleGenerateDeck() {
    const prompt = aiPrompt.trim();

    if (!prompt || isBusy) {
      return;
    }

    const requestVersion = beginRequest('ai');

    try {
      const result = await createAiDeckGenerationJob({
        prompt,
        targetLanguage: undefined,
        nativeLanguage: 'English',
        difficulty: 'Beginner',
        cardCount: 5,
        multiChoiceCount: 0,
        includeAudio: false,
      });

      setStatusText('Waiting for worker...');
      const deckId = await waitForGeneratedDeck(result.jobId, requestVersion);

      if (requestVersionRef.current !== requestVersion) {
        return;
      }

      const studyDeck = await prepareStudyDeck(
        {
          id: deckId,
          title: normalizeGeneratedTitle(prompt),
          description: 'Generated for your first session.',
          category: 'AI generated',
          color: 'magenta',
          visibility: 0,
          cards: [],
        },
        {
          title: normalizeGeneratedTitle(prompt),
          topic: 'AI generated',
          description: 'Generated for your first session.',
          color: 'magenta',
        }
      );

      if (requestVersionRef.current !== requestVersion) {
        return;
      }

      startStudy(studyDeck);
      toast({
        title: 'Deck ready',
        description: 'Five fresh cards are ready for your first run.',
      });
    } catch (error) {
      if (requestVersionRef.current === requestVersion) {
        setFlowError(getApiErrorDisplayMessage(error, 'Unable to generate a starter deck.'));
      }
    } finally {
      finishRequest(requestVersion);
    }
  }

  async function submitFirstSession(results: Record<string, boolean>) {
    if (!activeDeck) {
      return;
    }

    const responses = activeDeck.cards.map((card) => ({
      cardId: card.id,
      wasCorrect: Boolean(results[card.id]),
    }));
    const correctCount = responses.filter((response) => response.wasCorrect).length;
    const percentageCorrect = Math.round((correctCount / responses.length) * 100);

    setSaveStatus('saving');
    setSaveError(null);

    try {
      const savedSession = await submitStudySession({
        deckId: activeDeck.id,
        deckVersionId: activeDeck.deckVersionId,
        percentageCorrect,
        responses,
      });

      try {
        window.localStorage.setItem(
          'firstSessionActivation',
          JSON.stringify({
            deckId: activeDeck.id,
            deckTitle: activeDeck.title,
            known: correctCount,
            total: responses.length,
            completedAt: new Date().toISOString(),
          })
        );
      } catch {
        // The backend save is the source of truth; local storage just helps client hints.
      }

      setStudySessionId(savedSession.studySessionId);
      setSaveStatus('saved');
      router.refresh();
    } catch (error) {
      setSaveStatus('error');
      setSaveError(getApiErrorDisplayMessage(error, 'Unable to save your first study session.'));
    }
  }

  function handleRate(wasCorrect: boolean) {
    if (!currentCard || !activeDeck || saveStatus === 'saving') {
      return;
    }

    const nextResults = {
      ...cardResults,
      [currentCard.id]: wasCorrect,
    };
    const nextIndex = cardIndex + 1;

    setCardResults(nextResults);
    setIsFlipped(false);

    if (nextIndex >= activeDeck.cards.length) {
      setStep('save');
      void submitFirstSession(nextResults);
      return;
    }

    setCardIndex(nextIndex);
  }

  function changeDeck() {
    if (saveStatus === 'saving') {
      return;
    }

    setStep('pick');
    setActiveDeck(null);
    setCardIndex(0);
    setIsFlipped(false);
    setCardResults({});
    setSaveStatus('idle');
    setSaveError(null);
  }

  function retrySave() {
    if (saveStatus === 'saving') {
      return;
    }

    void submitFirstSession(cardResults);
  }

  function goToFeed() {
    router.push(nextPath || '/feed');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b-[3px] border-foreground bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[2px] border-foreground bg-neo-yellow shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold leading-none">First session</p>
              <p className="text-xs font-semibold text-muted-foreground">
                Five cards, then your feed wakes up.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={goToFeed}
            className="shrink-0 text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Skip for now
          </button>
        </div>

        <div className="container mx-auto px-4 pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === stepIndex;
              const isDone = index < stepIndex || (item.key === 'save' && saveStatus === 'saved');

              return (
                <div key={item.key} className="flex flex-1 items-center gap-2 sm:gap-3">
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-full border-[2px] border-foreground px-2.5 py-1.5 transition-colors sm:px-3',
                      isDone
                        ? 'bg-neo-teal'
                        : isActive
                          ? 'bg-neo-yellow shadow-[3px_3px_0_0_hsl(var(--foreground))]'
                          : 'bg-card'
                    )}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-[2px] border-foreground bg-background font-display text-xs font-bold">
                      {isDone ? <Check className="h-3 w-3" /> : index + 1}
                    </span>
                    <span className="hidden font-display text-sm font-semibold sm:inline">
                      {item.label}
                    </span>
                    <Icon className="h-4 w-4 sm:hidden" />
                  </div>
                  {index < STEPS.length - 1 ? (
                    <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-foreground/10">
                      <div
                        className="h-full bg-foreground transition-all duration-500"
                        style={{ width: index < stepIndex ? '100%' : '0%' }}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full border border-foreground/10 bg-muted">
            <div
              className="h-full bg-foreground transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 'pick' ? (
            <motion.section
              key="pick"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="mx-auto max-w-2xl text-center">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                  Welcome in, {firstName}
                </p>
                <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
                  Start with one tiny deck.
                </h1>
                <p className="mt-3 text-base font-medium text-muted-foreground">
                  Generate a focused set or pick a starter. The next screen is just five cards.
                </p>
              </div>

              <NeoCard variant="magenta" className="p-5 sm:p-6">
                <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[2px] border-foreground bg-neo-yellow shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                    <Wand2 className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="font-display text-xl font-bold">Generate with AI</h2>
                        <p className="text-sm font-medium text-foreground/75">
                          Keep the topic narrow and beginner-friendly.
                        </p>
                      </div>
                      <span className="rounded-full border-[2px] border-foreground bg-background px-3 py-1 text-xs font-bold uppercase">
                        5 cards
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={aiPrompt}
                        onChange={(event) => setAiPrompt(event.target.value)}
                        placeholder="Basic Italian greetings"
                        className="min-h-12 flex-1 rounded-xl border-[2px] border-foreground bg-background px-4 py-3 font-semibold outline-none transition focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                        disabled={isBusy}
                        maxLength={180}
                      />
                      <NeoButton
                        variant="dark"
                        onClick={() => {
                          void handleGenerateDeck();
                        }}
                        disabled={!aiPrompt.trim() || isBusy}
                        className="min-h-12"
                      >
                        {busyKind === 'ai' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        {busyKind === 'ai' ? 'Generating' : 'Generate'}
                      </NeoButton>
                    </div>
                    {busyKind === 'ai' && statusText ? (
                      <p className="mt-3 text-sm font-semibold text-foreground/75">{statusText}</p>
                    ) : null}
                  </div>
                </div>
              </NeoCard>

              <div className="flex items-center gap-3">
                <div className="h-[2px] flex-1 bg-foreground/15" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  or pick a starter
                </span>
                <div className="h-[2px] flex-1 bg-foreground/15" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {starterDeckCards.map((deck) => {
                  const isPreparing = busyKind === 'starter' && busyDeckId === deck.id;
                  const Icon = deck.Icon;

                  return (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => {
                        void handlePickStarter(deck);
                      }}
                      disabled={isBusy}
                      className="group h-full text-left disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <NeoCard
                        variant={deck.color}
                        className="flex h-full min-h-56 flex-col gap-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl border-[2px] border-foreground bg-background shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                            <Icon className="h-6 w-6" />
                          </span>
                          <span className="rounded-full border-[2px] border-foreground bg-background/80 px-2.5 py-1 text-xs font-bold">
                            {deck.cards.length} cards
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">
                            {deck.topic}
                          </p>
                          <h3 className="mt-1 font-display text-2xl font-bold leading-tight">
                            {deck.title}
                          </h3>
                          <p className="mt-2 text-sm font-medium opacity-80">{deck.description}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between border-t-[2px] border-foreground/20 pt-4 font-display text-sm font-bold">
                          <span>{isPreparing ? 'Preparing...' : 'Study this'}</span>
                          {isPreparing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          )}
                        </div>
                      </NeoCard>
                    </button>
                  );
                })}
              </div>

              {flowError ? (
                <p
                  role="alert"
                  className="rounded-xl border-[2px] border-destructive bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
                >
                  {flowError}
                </p>
              ) : null}
            </motion.section>
          ) : null}

          {step === 'study' && activeDeck && currentCard ? (
            <motion.section
              key="study"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-3xl space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={changeDeck}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Change deck
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full border-[2px] border-foreground px-3 py-1 text-xs font-bold uppercase',
                      getNeoColorClass(activeDeck.color, 'teal')
                    )}
                  >
                    {activeDeck.title}
                  </span>
                  <span className="rounded-full border-[2px] border-foreground bg-card px-3 py-1 text-xs font-bold uppercase">
                    Card {cardIndex + 1} / {activeDeck.cards.length}
                  </span>
                </div>
              </div>

              <div className="relative" style={{ perspective: 1200 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCard.id}
                    initial={{ opacity: 0, x: 36 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -36 }}
                    transition={{ duration: 0.24 }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsFlipped((value) => !value)}
                      className="w-full rounded-3xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
                      aria-label={isFlipped ? 'Show question' : 'Show answer'}
                    >
                      <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative min-h-[19rem] w-full sm:min-h-[23rem]"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <div
                          className="absolute inset-0 flex flex-col rounded-3xl border-[3px] border-foreground bg-card p-7 shadow-[8px_8px_0_0_hsl(var(--foreground))] sm:p-8"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <span className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                            Question
                          </span>
                          <div className="flex flex-1 items-center justify-center">
                            <p className="text-balance text-center font-display text-3xl font-bold leading-tight sm:text-4xl">
                              {currentCard.frontText}
                            </p>
                          </div>
                          <p className="text-center text-xs font-semibold text-muted-foreground">
                            Tap to reveal
                          </p>
                        </div>

                        <div
                          className={cn(
                            'absolute inset-0 flex flex-col rounded-3xl border-[3px] border-foreground p-7 shadow-[8px_8px_0_0_hsl(var(--foreground))] sm:p-8',
                            getNeoColorClass(activeDeck.color, 'teal')
                          )}
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <span className="text-xs font-bold uppercase tracking-[0.22em] opacity-70">
                            Answer
                          </span>
                          <div className="flex flex-1 items-center justify-center">
                            <p className="text-balance text-center font-display text-3xl font-bold leading-tight sm:text-4xl">
                              {currentCard.backText}
                            </p>
                          </div>
                          <p className="text-center text-xs font-semibold opacity-70">
                            Log how it went
                          </p>
                        </div>
                      </motion.div>
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                <NeoButton
                  variant="outline"
                  size="lg"
                  onClick={() => handleRate(false)}
                  disabled={!isFlipped}
                  className="flex-1 sm:flex-none"
                >
                  <RotateCcw className="h-4 w-4" />
                  Review again
                </NeoButton>
                <NeoButton
                  variant="success"
                  size="lg"
                  onClick={() => handleRate(true)}
                  disabled={!isFlipped}
                  className="flex-1 sm:flex-none"
                >
                  <Check className="h-4 w-4" />I knew it
                </NeoButton>
              </div>

              <div className="mx-auto flex max-w-sm items-center justify-center gap-1.5">
                {activeDeck.cards.map((card, index) => (
                  <span
                    key={card.id}
                    className={cn(
                      'h-3 w-3 rounded-full border-[2px] border-foreground transition-colors',
                      cardResults[card.id] === true
                        ? 'bg-neo-teal'
                        : cardResults[card.id] === false
                          ? 'bg-neo-coral'
                          : index === cardIndex
                            ? 'bg-neo-yellow'
                            : 'bg-muted'
                    )}
                  />
                ))}
              </div>

              {!isFlipped ? (
                <p className="text-center text-xs font-semibold text-muted-foreground">
                  Flip the card to rate it.
                </p>
              ) : null}
            </motion.section>
          ) : null}

          {step === 'save' && activeDeck ? (
            <motion.section
              key="save"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl space-y-6"
            >
              <div className="text-center">
                <motion.div
                  initial={{ rotate: -6, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.08 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-[3px] border-foreground bg-neo-yellow shadow-[6px_6px_0_0_hsl(var(--foreground))]"
                >
                  {saveStatus === 'saving' ? (
                    <Loader2 className="h-9 w-9 animate-spin" />
                  ) : (
                    <Trophy className="h-10 w-10" />
                  )}
                </motion.div>
                <h1 className="mt-5 font-display text-4xl font-bold leading-tight">
                  {saveStatus === 'saving'
                    ? 'Saving your first progress.'
                    : saveStatus === 'error'
                      ? 'Progress needs a retry.'
                      : 'First session, done.'}
                </h1>
                <p className="mx-auto mt-3 max-w-xl font-medium text-muted-foreground">
                  You studied {activeDeck.cards.length} cards from {activeDeck.title}.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <NeoCard variant="coral" className="p-5 text-center">
                  <Flame className="mx-auto mb-2 h-7 w-7" />
                  <p className="font-display text-3xl font-bold">
                    {saveStatus === 'saved' ? '1' : '-'}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em]">Streak starter</p>
                </NeoCard>
                <NeoCard variant="teal" className="p-5 text-center">
                  <Check className="mx-auto mb-2 h-7 w-7" />
                  <p className="font-display text-3xl font-bold">
                    {knownCount}/{activeDeck.cards.length}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em]">Known</p>
                </NeoCard>
                <NeoCard variant="yellow" className="p-5 text-center">
                  <Target className="mx-auto mb-2 h-7 w-7" />
                  <p className="font-display text-3xl font-bold">
                    {dailyGoalProgress}/{dailyGoal}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em]">Daily goal</p>
                </NeoCard>
              </div>

              {saveStatus === 'saving' ? (
                <p
                  role="status"
                  className="rounded-xl border-[2px] border-foreground bg-muted/60 px-4 py-3 text-center text-sm font-semibold"
                >
                  Logging {studiedCount} reviewed cards to your study history...
                </p>
              ) : null}

              {saveStatus === 'saved' ? (
                <NeoCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-lg font-bold">Saved to your feed</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      Session {studySessionId ? studySessionId.slice(0, 8) : 'saved'} is now part of
                      your progress.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link href="/decks/editor/new">
                      <NeoButton variant="outline" className="w-full sm:w-auto">
                        <Wand2 className="h-4 w-4" />
                        Build a bigger deck
                      </NeoButton>
                    </Link>
                    <NeoButton variant="primary" onClick={goToFeed} className="w-full sm:w-auto">
                      Go to feed
                      <ArrowRight className="h-4 w-4" />
                    </NeoButton>
                  </div>
                </NeoCard>
              ) : null}

              {saveStatus === 'error' ? (
                <NeoCard className="space-y-4 border-destructive bg-destructive/10 p-5">
                  <p className="text-sm font-semibold text-destructive">{saveError}</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <NeoButton variant="primary" onClick={retrySave}>
                      <Loader2 className="h-4 w-4" />
                      Retry save
                    </NeoButton>
                    <NeoButton variant="outline" onClick={changeDeck}>
                      Pick another deck
                    </NeoButton>
                  </div>
                </NeoCard>
              ) : null}
            </motion.section>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
