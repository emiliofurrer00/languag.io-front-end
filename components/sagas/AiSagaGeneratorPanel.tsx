'use client';

import { FormEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Layers, ListChecks, Loader2, Sparkles, Volume2, X } from 'lucide-react';
import { createAiSagaGenerationJob, getAiSagaGenerationJob } from '@/lib/sagas/client';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useModalFocus } from '@/hooks/useModalFocus';
import { getApiErrorDisplayMessage } from '@/lib/api';
import { cn } from '@/lib/utils';

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const minDeckCount = 2;
const maxDeckCount = 6;
const minCardsPerDeck = 5;
const maxCardsPerDeck = 15;

type GenerationPhase = 'idle' | 'pending' | 'completed' | 'failed';

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

export default function AiSagaGeneratorPanel() {
  const router = useRouter();
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [deckCount, setDeckCount] = useState(3);
  const [cardsPerDeck, setCardsPerDeck] = useState(8);
  const [multiChoiceCountPerDeck, setMultiChoiceCountPerDeck] = useState(0);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [phase, setPhase] = useState<GenerationPhase>('idle');
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const closePanel = useCallback(() => setIsOpen(false), []);

  const canSubmit = useMemo(
    () =>
      prompt.trim().length > 0 &&
      prompt.trim().length <= 1000 &&
      deckCount >= minDeckCount &&
      deckCount <= maxDeckCount &&
      cardsPerDeck >= minCardsPerDeck &&
      cardsPerDeck <= maxCardsPerDeck &&
      multiChoiceCountPerDeck >= 0 &&
      multiChoiceCountPerDeck <= cardsPerDeck &&
      phase !== 'pending',
    [cardsPerDeck, deckCount, multiChoiceCountPerDeck, phase, prompt]
  );

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  useBodyScrollLock(isOpen);
  useModalFocus({
    isOpen,
    containerRef: dialogRef,
    initialFocusRef: promptRef,
    onEscape: closePanel,
  });

  async function pollJob(jobId: string) {
    try {
      const job = await getAiSagaGenerationJob(jobId);

      if (job.status === 'Completed' && job.createdSagaId) {
        setPhase('completed');
        setStatusText('Saga ready');
        closePanel();
        router.push(`/sagas/${job.createdSagaId}`);
        router.refresh();
        return;
      }

      if (job.status === 'Failed') {
        setPhase('failed');
        setError(job.errorMessage || 'Saga generation failed. Try a narrower prompt.');
        setIsOpen(true);
        return;
      }

      setStatusText(job.status === 'Processing' ? 'Building saga...' : 'Waiting for worker...');
      pollTimeoutRef.current = setTimeout(() => void pollJob(jobId), 2500);
    } catch (pollError) {
      setPhase('failed');
      setError(getApiErrorDisplayMessage(pollError, 'Unable to check job status.'));
      setIsOpen(true);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setPhase('pending');
    setError(null);
    setStatusText('Creating generation job...');

    try {
      const result = await createAiSagaGenerationJob({
        prompt: prompt.trim(),
        targetLanguage: targetLanguage.trim() || undefined,
        nativeLanguage: nativeLanguage.trim() || undefined,
        difficulty,
        deckCount,
        cardsPerDeck,
        multiChoiceCountPerDeck,
        includeAudio,
      });

      setStatusText('Waiting for worker...');
      await pollJob(result.jobId);
    } catch (createError) {
      setPhase('failed');
      setError(getApiErrorDisplayMessage(createError, 'Unable to create a generation job.'));
    }
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closePanel();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-primary px-4 font-display text-sm font-bold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {phase === 'pending' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {phase === 'pending' ? 'Generating...' : 'Generate with AI'}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/45 px-4 py-6 backdrop-blur-sm"
          onMouseDown={closeFromBackdrop}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-saga-generator-title"
            tabIndex={-1}
            className="max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-xl border-[3px] border-foreground bg-neo-yellow p-4 shadow-[8px_8px_0_0_hsl(var(--foreground))] sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-background shadow-[2px_2px_0_0_hsl(var(--foreground))]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="ai-saga-generator-title" className="font-display text-2xl font-bold">
                    Generate a saga
                  </h2>
                  <p className="text-sm font-medium text-foreground/70">
                    One AI saga can be generated per week.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close generator"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-background transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
                <div>
                  <label className="sr-only" htmlFor="ai-saga-prompt">
                    Saga prompt
                  </label>
                  <textarea
                    ref={promptRef}
                    id="ai-saga-prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={5}
                    maxLength={1000}
                    placeholder="Create a beginner Spanish saga for travel conversations, from greetings to asking for directions"
                    className="min-h-36 w-full resize-y rounded-lg border-[2px] border-foreground bg-background px-3 py-2 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    disabled={phase === 'pending'}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <label className="grid gap-1 text-xs font-bold uppercase tracking-normal">
                    Target
                    <input
                      value={targetLanguage}
                      onChange={(event) => setTargetLanguage(event.target.value)}
                      placeholder="Spanish"
                      className="h-10 rounded-lg border-[2px] border-foreground bg-background px-3 text-sm normal-case outline-none focus:ring-2 focus:ring-ring"
                      disabled={phase === 'pending'}
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-bold uppercase tracking-normal">
                    Native
                    <input
                      value={nativeLanguage}
                      onChange={(event) => setNativeLanguage(event.target.value)}
                      placeholder="English"
                      className="h-10 rounded-lg border-[2px] border-foreground bg-background px-3 text-sm normal-case outline-none focus:ring-2 focus:ring-ring"
                      disabled={phase === 'pending'}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_7rem_8rem] lg:items-end">
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setDifficulty(option)}
                      className={cn(
                        'h-10 rounded-full border-[2px] border-foreground px-4 text-sm font-bold transition',
                        difficulty === option
                          ? 'bg-foreground text-background'
                          : 'bg-background hover:-translate-y-0.5'
                      )}
                      disabled={phase === 'pending'}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <label className="grid gap-1 text-xs font-bold uppercase tracking-normal">
                  Decks
                  <input
                    type="number"
                    min={minDeckCount}
                    max={maxDeckCount}
                    value={deckCount}
                    onChange={(event) =>
                      setDeckCount(
                        clampNumber(Number(event.target.value), minDeckCount, maxDeckCount)
                      )
                    }
                    className="h-10 rounded-lg border-[2px] border-foreground bg-background px-3 text-sm normal-case outline-none focus:ring-2 focus:ring-ring"
                    disabled={phase === 'pending'}
                  />
                </label>

                <label className="grid gap-1 text-xs font-bold uppercase tracking-normal">
                  Cards/deck
                  <input
                    type="number"
                    min={minCardsPerDeck}
                    max={maxCardsPerDeck}
                    value={cardsPerDeck}
                    onChange={(event) => {
                      const nextCardsPerDeck = clampNumber(
                        Number(event.target.value),
                        minCardsPerDeck,
                        maxCardsPerDeck
                      );
                      setCardsPerDeck(nextCardsPerDeck);
                      setMultiChoiceCountPerDeck((current) => Math.min(current, nextCardsPerDeck));
                    }}
                    className="h-10 rounded-lg border-[2px] border-foreground bg-background px-3 text-sm normal-case outline-none focus:ring-2 focus:ring-ring"
                    disabled={phase === 'pending'}
                  />
                </label>

                <label className="grid gap-1 text-xs font-bold uppercase tracking-normal sm:col-span-2">
                  <span className="inline-flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Multiple choice per deck
                  </span>
                  <div className="grid gap-2 rounded-lg border-[2px] border-foreground bg-background px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Slider
                        min={0}
                        max={cardsPerDeck}
                        step={1}
                        value={[multiChoiceCountPerDeck]}
                        onValueChange={([value]) => setMultiChoiceCountPerDeck(value ?? 0)}
                        disabled={phase === 'pending'}
                        aria-label="Multiple-choice cards per deck"
                      />
                      <input
                        type="number"
                        min={0}
                        max={cardsPerDeck}
                        value={multiChoiceCountPerDeck}
                        onChange={(event) =>
                          setMultiChoiceCountPerDeck(
                            clampNumber(Number(event.target.value), 0, cardsPerDeck)
                          )
                        }
                        className="h-8 w-14 rounded-md border-[2px] border-foreground bg-background px-2 text-center text-sm normal-case outline-none focus:ring-2 focus:ring-ring"
                        disabled={phase === 'pending'}
                        aria-label="Multiple-choice cards per deck"
                      />
                    </div>
                  </div>
                </label>

                <label className="flex h-11 items-center justify-between gap-3 rounded-full border-[2px] border-foreground bg-background px-3">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-normal">
                    <Volume2 className="h-4 w-4" />
                    Audio
                  </span>
                  <Switch
                    checked={includeAudio}
                    onCheckedChange={setIncludeAudio}
                    disabled={phase === 'pending'}
                    aria-label="Generate target-language audio"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold sm:col-span-2 lg:col-span-1">
                  <span className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-background px-3">
                    <Layers className="h-4 w-4" />
                    {deckCount}
                  </span>
                  <span className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-background px-3">
                    <BookOpen className="h-4 w-4" />
                    {deckCount * cardsPerDeck}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-primary px-5 font-display font-bold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-3"
                >
                  {phase === 'pending' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate saga
                </button>
              </div>

              {statusText || error ? (
                <p
                  role={error ? 'alert' : 'status'}
                  className={cn(
                    'mt-3 text-sm font-semibold',
                    error ? 'text-destructive' : 'text-foreground/75'
                  )}
                >
                  {error ?? statusText}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
