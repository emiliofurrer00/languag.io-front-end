'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Compass,
  Flag,
  GripVertical,
  Layers,
  Lock,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import AppNavbar from '@/components/layout/AppNavbar';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { toast } from '@/hooks/useToast';
import { createSaga } from '@/lib/sagas/client';
import { NEO_COLOR_OPTIONS, NeoColor, getNeoColorClass } from '@/lib/theme/neo-colors';
import { DeckSummary } from '@/lib/decks/types';
import { cn } from '@/lib/utils';
import AiSagaGeneratorPanel from './AiSagaGeneratorPanel';

type SagaNodeKind = 'deck' | 'checkpoint';

type SagaNodeDraft = {
  id: string;
  kind: SagaNodeKind;
  deckId?: string;
  title: string;
  cardCount?: number;
  color?: string | null;
  visibility?: number;
};

type SagaEditorContainerProps = {
  availableDecks: DeckSummary[];
};

const EMOJIS = ['🌶️', '💻', '🧠', '🎨', '🚀', '📚', '🎵', '🌍', '⚡', '🔥'];
const DEFAULT_CHAPTER_TITLE = 'Chapter 1';

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDeckCardCount(deck: DeckSummary) {
  return deck.cards?.length ?? 0;
}

function getDeckXp(cardCount: number) {
  return Math.max(80, Math.round(cardCount * 5));
}

function getDeckVisibilityLabel(visibility?: number) {
  return visibility ? 'Public' : 'Private';
}

function buildChapters(nodes: SagaNodeDraft[]) {
  const chapters: Array<{
    title: string;
    description: string | null;
    order: number;
    lessons: Array<{
      deckId: string;
      title: string;
      description: string | null;
      order: number;
    }>;
  }> = [];
  let currentChapterTitle = DEFAULT_CHAPTER_TITLE;
  let currentChapterDescription: string | null = null;
  let currentLessons: Array<{
    deckId: string;
    title: string;
    description: string | null;
    order: number;
  }> = [];

  const flushChapter = () => {
    if (currentLessons.length === 0) {
      return;
    }

    chapters.push({
      title: currentChapterTitle,
      description: currentChapterDescription,
      order: chapters.length,
      lessons: currentLessons.map((lesson, index) => ({
        ...lesson,
        order: index,
      })),
    });
    currentLessons = [];
  };

  nodes.forEach((node) => {
    if (node.kind === 'checkpoint') {
      flushChapter();
      currentChapterTitle = node.title.trim() || `Chapter ${chapters.length + 1}`;
      currentChapterDescription = 'Checkpoint';
      return;
    }

    if (!node.deckId) {
      return;
    }

    currentLessons.push({
      deckId: node.deckId,
      title: node.title,
      description: null,
      order: currentLessons.length,
    });
  });

  flushChapter();

  return chapters;
}

export default function SagaEditorContainer({ availableDecks }: SagaEditorContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🌶️');
  const [color, setColor] = useState<NeoColor>('coral');
  const [visibility, setVisibility] = useState(0);
  const [nodes, setNodes] = useState<SagaNodeDraft[]>([]);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addedDeckIds = useMemo(
    () => new Set(nodes.filter((node) => node.deckId).map((node) => node.deckId)),
    [nodes]
  );
  const deckCount = nodes.filter((node) => node.kind === 'deck').length;
  const stepCount = nodes.length;
  const totalXp = nodes.reduce(
    (sum, node) => sum + (node.kind === 'deck' ? getDeckXp(node.cardCount ?? 0) : 0),
    0
  );
  const selectedPrivateDeckCount = nodes.filter(
    (node) => node.kind === 'deck' && !node.visibility
  ).length;
  const isPublic = visibility === 1;
  const hasPrivateDeckInPublicSaga = isPublic && selectedPrivateDeckCount > 0;
  const isValid = title.trim().length > 0 && deckCount > 0 && !hasPrivateDeckInPublicSaga;
  const filteredDecks = availableDecks.filter((deck) => {
    if (addedDeckIds.has(deck.id)) {
      return false;
    }

    const query = search.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return (
      deck.title.toLowerCase().includes(query) ||
      (deck.category || '').toLowerCase().includes(query)
    );
  });

  function addDeck(deck: DeckSummary) {
    setNodes((currentNodes) => [
      ...currentNodes,
      {
        id: makeId(),
        kind: 'deck',
        deckId: deck.id,
        title: deck.title || 'Untitled deck',
        cardCount: getDeckCardCount(deck),
        color: deck.color,
        visibility: deck.visibility,
      },
    ]);
    setErrorMessage(null);
  }

  function addCheckpoint() {
    setNodes((currentNodes) => [
      ...currentNodes,
      {
        id: makeId(),
        kind: 'checkpoint',
        title: `Chapter ${currentNodes.filter((node) => node.kind === 'checkpoint').length + 2}`,
      },
    ]);
  }

  function removeNode(id: string) {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
  }

  function moveNode(index: number, direction: -1 | 1) {
    setNodes((currentNodes) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= currentNodes.length) {
        return currentNodes;
      }

      const nextNodes = [...currentNodes];
      [nextNodes[index], nextNodes[targetIndex]] = [nextNodes[targetIndex], nextNodes[index]];
      return nextNodes;
    });
  }

  function updateNode(id: string, patch: Partial<SagaNodeDraft>) {
    setNodes((currentNodes) =>
      currentNodes.map((node) => (node.id === id ? { ...node, ...patch } : node))
    );
  }

  function handleSave() {
    if (!title.trim()) {
      setErrorMessage('Saga title is required.');
      return;
    }

    if (deckCount === 0) {
      setErrorMessage('Add at least one deck to the saga path.');
      return;
    }

    if (hasPrivateDeckInPublicSaga) {
      setErrorMessage('Public sagas can only include public decks.');
      return;
    }

    const chapters = buildChapters(nodes);

    startTransition(async () => {
      setErrorMessage(null);

      try {
        const result = await createSaga({
          title: title.trim(),
          tagline: tagline.trim(),
          description: description.trim() || null,
          emoji,
          color,
          visibility,
          chapters,
        });

        toast({
          title: 'Saga saved',
          description: `${title.trim()} is ready to study.`,
        });

        router.push(`/sagas/${result.sagaId}`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message.split(': ').pop() : 'Unable to save saga.';
        setErrorMessage(message || 'Unable to save saga.');
      }
    });
  }

  const renderSaveButton = (compact = false) => (
    <NeoButton
      variant="primary"
      size="sm"
      className={cn('cursor-pointer text-sm md:text-base', compact ? 'h-11 w-11 p-0' : null)}
      onClick={handleSave}
      disabled={isPending || !isValid}
      aria-label="Save saga"
    >
      <Save className="h-4 w-4" />
      {compact ? <span className="sr-only">Save saga</span> : isPending ? 'Saving...' : 'Save Saga'}
    </NeoButton>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-background pt-24 sm:pt-28">
      <AppNavbar
        leftContent={
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/sagas"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-secondary p-0 font-display text-sm font-semibold text-secondary-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:shadow-[4px_4px_0_0_hsl(var(--foreground))]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:block">Back</span>
            </Link>
            <span className="truncate font-display text-sm font-bold md:text-xl">Create Saga</span>
          </div>
        }
        actions={renderSaveButton()}
        mobileActions={renderSaveButton(true)}
        showDesktopSideNav
      />

      <main className="mx-auto grid w-full max-w-7xl items-start gap-5 px-3 pb-12 sm:gap-6 sm:px-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.85fr)] xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <NeoCard size="md" className="overflow-hidden p-4 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <h1 className="font-display text-xl font-bold">Saga Details</h1>
              </div>
              <AiSagaGeneratorPanel />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-display font-bold" htmlFor="saga-title">
                Title *
                <input
                  id="saga-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Spanish Journey"
                  maxLength={200}
                  className="mt-1.5 block h-11 w-full rounded-xl border-[2px] border-foreground bg-background px-3 py-2 font-body font-normal focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block text-sm font-display font-bold" htmlFor="saga-tagline">
                Tagline
                <input
                  id="saga-tagline"
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  placeholder="From hola to fluent conversations"
                  maxLength={70}
                  className="mt-1.5 block h-11 w-full rounded-xl border-[2px] border-foreground bg-background px-3 py-2 font-body font-normal focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block text-sm font-display font-bold" htmlFor="saga-description">
                Description
                <textarea
                  id="saga-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What will learners master in this saga?"
                  maxLength={1000}
                  className="mt-1.5 min-h-28 w-full resize-y rounded-xl border-[2px] border-foreground bg-background px-3 py-2 font-body font-normal focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-display font-bold">Emoji</p>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setEmoji(option)}
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-foreground text-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2',
                          emoji === option
                            ? 'bg-neo-yellow shadow-[3px_3px_0_0_hsl(var(--foreground))] -translate-y-0.5'
                            : 'bg-background hover:bg-muted'
                        )}
                        aria-label={`Use ${option} emoji`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-display font-bold">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {NEO_COLOR_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setColor(option.id)}
                        aria-label={option.name}
                        className={cn(
                          'h-10 w-10 rounded-xl border-[2px] border-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2',
                          option.className,
                          color === option.id
                            ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background shadow-[3px_3px_0_0_hsl(var(--foreground))] -translate-y-0.5'
                            : 'hover:-translate-y-0.5'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <label
                htmlFor="saga-public"
                className="flex flex-col items-start justify-between gap-3 rounded-xl border-[2px] border-foreground bg-muted/50 px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-4"
              >
                <span className="flex min-w-0 items-center gap-3">
                  {isPublic ? <Compass className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  <span>
                    <span className="block font-display text-sm font-bold">
                      {isPublic ? 'Public Saga' : 'Private Saga'}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {isPublic ? 'Everyone can view this path.' : 'Only you can view this path.'}
                    </span>
                  </span>
                </span>
                <input
                  id="saga-public"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(event) => setVisibility(event.target.checked ? 1 : 0)}
                  className="h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
                />
              </label>
            </div>
          </NeoCard>

          <NeoCard size="md" className="overflow-hidden p-4 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">Saga Path</h2>
                <p className="text-sm text-muted-foreground">
                  {stepCount} {stepCount === 1 ? 'step' : 'steps'} · checkpoints start chapters
                </p>
              </div>
              <NeoButton variant="outline" size="sm" onClick={addCheckpoint}>
                <Flag className="h-4 w-4" />
                Checkpoint
              </NeoButton>
            </div>

            {nodes.length === 0 ? (
              <div className="rounded-xl border-[2px] border-dashed border-muted-foreground/40 py-10 text-center">
                <Layers className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-display font-bold">No steps yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add decks from the library to start the path.
                </p>
              </div>
            ) : (
              <ol className="space-y-3">
                {nodes.map((node, index) => {
                  const isCheckpoint = node.kind === 'checkpoint';
                  const tone = isCheckpoint
                    ? 'bg-neo-yellow'
                    : getNeoColorClass(node.color, 'teal');
                  const cardCount = node.cardCount ?? 0;

                  return (
                    <li
                      key={node.id}
                      className={cn(
                        'grid grid-cols-[auto_auto_auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border-[2px] border-foreground p-3 shadow-[3px_3px_0_0_hsl(var(--foreground))] sm:gap-3',
                        tone
                      )}
                    >
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <button
                          type="button"
                          onClick={() => moveNode(index, -1)}
                          disabled={index === 0}
                          className="rounded p-1 hover:bg-foreground/10 disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 opacity-50" />
                        <button
                          type="button"
                          onClick={() => moveNode(index, 1)}
                          disabled={index === nodes.length - 1}
                          className="rounded p-1 hover:bg-foreground/10 disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2px] border-foreground bg-background font-display text-sm font-extrabold sm:h-10 sm:w-10">
                        {index + 1}
                      </div>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2px] border-foreground bg-background">
                        {isCheckpoint ? (
                          <Flag className="h-4 w-4" />
                        ) : (
                          <BookOpen className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        {isCheckpoint ? (
                          <input
                            value={node.title}
                            onChange={(event) => updateNode(node.id, { title: event.target.value })}
                            className="w-full border-none bg-transparent font-display font-bold outline-none focus:underline"
                            aria-label="Checkpoint title"
                          />
                        ) : (
                          <>
                            <p className="truncate font-display font-bold">{node.title}</p>
                            <p className="text-xs opacity-80">
                              {cardCount} cards · {getDeckXp(cardCount)} XP ·{' '}
                              {getDeckVisibilityLabel(node.visibility)}
                            </p>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeNode(node.id)}
                        className="justify-self-end rounded-lg border-[2px] border-foreground bg-background p-2 transition-colors hover:bg-neo-coral"
                        aria-label="Remove step"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}

            {errorMessage ? (
              <div className="mt-5 rounded-xl border-[2px] border-destructive bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                {errorMessage}
              </div>
            ) : null}
          </NeoCard>
        </div>

        <aside className="min-w-0 space-y-5 sm:space-y-6">
          <NeoCard variant={color} size="md" className="p-4 sm:p-6">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-foreground bg-background text-2xl shadow-[3px_3px_0_0_hsl(var(--foreground))] sm:h-14 sm:w-14">
                {emoji}
              </div>
              <span className="whitespace-nowrap rounded-full border-[2px] border-foreground bg-background px-3 py-1 text-xs font-bold uppercase">
                {deckCount} {deckCount === 1 ? 'deck' : 'decks'}
              </span>
            </div>
            <h3 className="break-words font-display text-lg font-bold leading-tight sm:text-xl">
              {title || 'Untitled Saga'}
            </h3>
            <p className="mb-3 mt-1 break-words text-sm font-semibold opacity-80">
              {tagline || 'Add a tagline to inspire learners'}
            </p>
            <div className="flex flex-wrap items-center gap-3 border-t-[2px] border-foreground/20 pt-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" />
                {totalXp.toLocaleString()} XP
              </span>
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {stepCount} steps
              </span>
            </div>
          </NeoCard>

          <NeoCard size="md" className="p-4 sm:p-6">
            <h3 className="mb-3 font-display text-lg font-bold">Add Decks</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search decks..."
                className="h-10 w-full rounded-xl border-[2px] border-foreground bg-background pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto pr-1 sm:max-h-[480px]">
              {filteredDecks.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {availableDecks.length === 0
                    ? 'Create a deck first, then add it here.'
                    : addedDeckIds.size === availableDecks.length
                      ? 'All decks added.'
                      : 'No decks match your search.'}
                </p>
              ) : (
                filteredDecks.map((deck) => {
                  const cardCount = getDeckCardCount(deck);

                  return (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => addDeck(deck)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border-[2px] border-foreground p-3 text-left shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none',
                        getNeoColorClass(deck.color, 'teal')
                      )}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[2px] border-foreground bg-background">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-bold">{deck.title}</p>
                        <p className="truncate text-[11px] opacity-80">
                          {deck.category || 'Uncategorized'} · {cardCount} cards ·{' '}
                          {getDeckVisibilityLabel(deck.visibility)}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 shrink-0" />
                    </button>
                  );
                })
              )}
            </div>

            {hasPrivateDeckInPublicSaga ? (
              <div className="mt-4 flex gap-2 rounded-xl border-[2px] border-foreground bg-neo-coral/40 px-3 py-2 text-xs font-semibold">
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Switch to private or remove private decks before saving.
              </div>
            ) : null}
          </NeoCard>
        </aside>
      </main>
    </div>
  );
}
