'use client';

import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListChecks, Loader2, Sparkles, Volume2, X } from 'lucide-react';
import {
  createAiDeckGenerationJob,
  getAiDeckGenerationJob,
} from '@/lib/decks/client';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const minCardCount = 5;
const maxCardCount = 20;

type GenerationPhase = 'idle' | 'pending' | 'completed' | 'failed';

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

export default function AiDeckGeneratorPanel() {
  const router = useRouter();
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [cardCount, setCardCount] = useState(12);
  const [multiChoiceCount, setMultiChoiceCount] = useState(0);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [phase, setPhase] = useState<GenerationPhase>('idle');
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () =>
      prompt.trim().length > 0 &&
      prompt.trim().length <= 1000 &&
      cardCount >= minCardCount &&
      cardCount <= maxCardCount &&
      multiChoiceCount >= 0 &&
      multiChoiceCount <= cardCount &&
      phase !== 'pending',
    [cardCount, multiChoiceCount, phase, prompt]
  );

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    promptRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  async function pollJob(jobId: string) {
    try {
      const job = await getAiDeckGenerationJob(jobId);

      if (job.status === 'Completed' && job.createdDeckId) {
        setPhase('completed');
        setStatusText('Deck ready');
        setIsOpen(false);
        router.push(`/decks/editor/${job.createdDeckId}`);
        router.refresh();
        return;
      }

      if (job.status === 'Failed') {
        setPhase('failed');
        setError(job.errorMessage || 'Deck generation failed. Try a narrower prompt.');
        setIsOpen(true);
        return;
      }

      setStatusText(job.status === 'Processing' ? 'Building cards...' : 'Waiting for worker...');
      pollTimeoutRef.current = setTimeout(() => void pollJob(jobId), 2000);
    } catch (pollError) {
      setPhase('failed');
      setError(pollError instanceof Error ? pollError.message : 'Unable to check job status.');
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
      const result = await createAiDeckGenerationJob({
        prompt: prompt.trim(),
        targetLanguage: targetLanguage.trim() || undefined,
        nativeLanguage: nativeLanguage.trim() || undefined,
        difficulty,
        cardCount,
        multiChoiceCount,
        includeAudio,
      });

      setStatusText('Waiting for worker...');
      await pollJob(result.jobId);
    } catch (createError) {
      setPhase('failed');
      setError(
        createError instanceof Error
          ? createError.message
          : 'Unable to create a generation job.'
      );
    }
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-deck-generator-title"
            className="max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-xl border-[3px] border-foreground bg-neo-yellow p-4 shadow-[8px_8px_0_0_hsl(var(--foreground))] sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-background shadow-[2px_2px_0_0_hsl(var(--foreground))]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="ai-deck-generator-title" className="font-display text-2xl font-bold">
                    Generate a deck
                  </h2>
                  <p className="text-sm font-medium text-foreground/70">
                    Describe a focused lesson and let the worker build the cards.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close generator"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-background transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
                <div>
                  <label className="sr-only" htmlFor="ai-deck-prompt">
                    Deck prompt
                  </label>
                  <textarea
                    ref={promptRef}
                    id="ai-deck-prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={5}
                    maxLength={1000}
                    placeholder="Create a beginner French deck for ordering food in restaurants"
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
                      placeholder="French"
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

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
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
                  Cards
                  <input
                    type="number"
                    min={minCardCount}
                    max={maxCardCount}
                    value={cardCount}
                    onChange={(event) => {
                      const nextCardCount = clampNumber(
                        Number(event.target.value),
                        minCardCount,
                        maxCardCount
                      );
                      setCardCount(nextCardCount);
                      setMultiChoiceCount((current) => Math.min(current, nextCardCount));
                    }}
                    className="h-10 rounded-lg border-[2px] border-foreground bg-background px-3 text-sm normal-case outline-none focus:ring-2 focus:ring-ring"
                    disabled={phase === 'pending'}
                  />
                </label>

                <label className="grid gap-1 text-xs font-bold uppercase tracking-normal sm:col-span-2 lg:col-span-1">
                  <span className="inline-flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Multiple choice
                  </span>
                  <div className="grid gap-2 rounded-lg border-[2px] border-foreground bg-background px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Slider
                        min={0}
                        max={cardCount}
                        step={1}
                        value={[multiChoiceCount]}
                        onValueChange={([value]) => setMultiChoiceCount(value ?? 0)}
                        disabled={phase === 'pending'}
                        aria-label="Multiple-choice question count"
                      />
                      <input
                        type="number"
                        min={0}
                        max={cardCount}
                        value={multiChoiceCount}
                        onChange={(event) =>
                          setMultiChoiceCount(
                            clampNumber(Number(event.target.value), 0, cardCount)
                          )
                        }
                        className="h-8 w-14 rounded-md border-[2px] border-foreground bg-background px-2 text-center text-sm normal-case outline-none focus:ring-2 focus:ring-ring"
                        disabled={phase === 'pending'}
                        aria-label="Multiple-choice question count"
                      />
                    </div>
                  </div>
                </label>

                <label className="flex h-11 items-center justify-between gap-3 rounded-full border-[2px] border-foreground bg-background px-3 sm:col-span-2 lg:col-span-1">
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

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-primary px-5 font-display font-bold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {phase === 'pending' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate
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
