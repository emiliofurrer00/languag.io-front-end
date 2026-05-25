'use client';

import DeckCard from './DeckCard';
import DeckFilters from './DeckFilters';
import Navbar from './Navbar';
import { DeckSummary } from '@/lib/decks/types';
import { getDeckPage } from '@/lib/decks/client';
import { buildLoginRedirectPath } from '@/lib/auth-flow';
import { AppStatePanel, stateActionClassName } from '@/components/ui/AppStatePanel';
import {
  BookOpen,
  Compass,
  Layers,
  LoaderCircle,
  Plus,
  RefreshCcw,
  SearchX,
  UserPlus,
  WifiOff,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type DeckListFilters = {
  searchQuery?: string;
  ownerUsername?: string;
  pageSize?: number;
};

type DeckListContainerProps = {
  decks: DeckSummary[];
  nextCursor?: string | null;
  filters?: DeckListFilters;
  currentUsername?: string;
  isAuthenticated?: boolean;
  serviceError?: string | null;
};

const secondaryActionClassName =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-secondary px-4 font-display text-sm font-semibold text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function normalizeUsername(username?: string | null) {
  return username?.trim().replace(/^@/, '').toLowerCase();
}

function canEditDeck(deck: DeckSummary, currentUsername?: string) {
  if (typeof deck.canEdit === 'boolean') {
    return deck.canEdit;
  }

  if (typeof deck.isOwner === 'boolean') {
    return deck.isOwner;
  }

  const deckOwnerUsername = normalizeUsername(deck.ownerUsername);
  const normalizedCurrentUsername = normalizeUsername(currentUsername);

  return Boolean(deckOwnerUsername && normalizedCurrentUsername === deckOwnerUsername);
}

function getDeckListViewCopy({
  ownerUsername,
  isAuthenticated,
  hasSearchQuery,
  isViewingOwnerDecks,
}: {
  ownerUsername?: string;
  isAuthenticated: boolean;
  hasSearchQuery: boolean;
  isViewingOwnerDecks: boolean;
}) {
  if (isViewingOwnerDecks) {
    return {
      title: ownerUsername ? `@${ownerUsername}'s public decks` : 'Public decks',
      description: 'Browse public decks shared by this creator.',
      emptyTitle: ownerUsername ? `No public decks from @${ownerUsername}` : 'No public decks found',
      emptyDescription: hasSearchQuery
        ? 'Try a different search, or clear the creator filter to browse the full library.'
        : 'This creator has not published a public deck yet.',
      emptyKicker: 'No results',
    };
  }

  if (hasSearchQuery) {
    return {
      title: isAuthenticated ? 'Your decks' : 'Public decks',
      description: isAuthenticated
        ? 'Preview a deck, study what is due, or create a fresh set from scratch.'
        : 'Preview community decks and try a study run before creating an account.',
      emptyTitle: 'No decks match your search',
      emptyDescription: 'Try a different search, or clear the filter to see your full list.',
      emptyKicker: 'No results',
    };
  }

  if (isAuthenticated) {
    return {
      title: 'Your decks',
      description: 'Preview a deck, study what is due, or create a fresh set from scratch.',
      emptyTitle: 'Start your deck shelf',
      emptyDescription:
        'Create one small deck to unlock study recommendations and a cleaner daily practice loop.',
      emptyKicker: 'First deck',
    };
  }

  return {
    title: 'Public decks',
    description: 'Preview community decks and try a study run before creating an account.',
    emptyTitle: 'The public shelf is still empty',
    emptyDescription: 'Sign in to build the first public deck and give the library somewhere to begin.',
    emptyKicker: 'No results',
  };
}

export default function DeckListContainer({
  decks,
  nextCursor,
  filters,
  currentUsername,
  isAuthenticated = false,
  serviceError,
}: DeckListContainerProps) {
  const router = useRouter();
  const searchQuery = filters?.searchQuery ?? '';
  const ownerUsername = filters?.ownerUsername?.trim();
  const pageSize = filters?.pageSize;
  const [visibleDecks, setVisibleDecks] = useState(decks);
  const [cursor, setCursor] = useState(nextCursor ?? null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const isViewingOwnerDecks = Boolean(ownerUsername);
  const hasSearchQuery = Boolean(searchQuery.trim());
  const viewCopy = getDeckListViewCopy({
    ownerUsername,
    isAuthenticated,
    hasSearchQuery,
    isViewingOwnerDecks,
  });
  const EmptyIcon =
    isViewingOwnerDecks || hasSearchQuery ? SearchX : isAuthenticated ? BookOpen : Layers;
  const deckCountLabel = cursor ? `${visibleDecks.length}+` : visibleDecks.length;

  useEffect(() => {
    setVisibleDecks(decks);
    setCursor(nextCursor ?? null);
    setIsLoadingMore(false);
    setLoadMoreError(null);
  }, [decks, nextCursor, searchQuery, ownerUsername, pageSize]);

  async function handleLoadMore() {
    if (!cursor || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const page = await getDeckPage({
        searchQuery,
        username: ownerUsername,
        cursor,
        pageSize,
      });

      setVisibleDecks((currentDecks) => [...currentDecks, ...page.items]);
      setCursor(page.nextCursor ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load more decks.';
      setLoadMoreError(message.replace(/^API request failed for [^:]+:\s*/, ''));
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <>
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 pb-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">{viewCopy.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{viewCopy.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/sagas" className={secondaryActionClassName}>
              <Compass className="h-4 w-4" />
              Explore sagas
            </Link>
            <span className="inline-flex h-12 w-fit items-center gap-2 rounded-xl border-[2px] border-foreground bg-secondary px-4 text-sm font-semibold shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <Layers className="h-4 w-4" />
              {deckCountLabel} {visibleDecks.length === 1 && !cursor ? 'deck' : 'decks'}
            </span>
          </div>
        </div>

        <DeckFilters searchQuery={searchQuery} ownerUsername={ownerUsername} />

        {serviceError ? (
          <AppStatePanel
            icon={WifiOff}
            tone="error"
            kicker="Backend offline"
            title="Decks could not check in"
            description={serviceError}
            className="mx-auto max-w-2xl"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => router.refresh()}
                className={stateActionClassName}
              >
                <RefreshCcw className="h-4 w-4" />
                Try again
              </button>
              <Link href="/" className={stateActionClassName}>
                Back home
              </Link>
            </div>
          </AppStatePanel>
        ) : visibleDecks.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deckData={deck}
                  canEdit={canEditDeck(deck, currentUsername)}
                />
              ))}
            </div>
            {loadMoreError ? (
              <p className="mt-5 text-center text-sm font-semibold text-destructive">
                {loadMoreError}
              </p>
            ) : null}
            {cursor ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={secondaryActionClassName}
                >
                  {isLoadingMore ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  Load more
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <AppStatePanel
            icon={EmptyIcon}
            kicker={viewCopy.emptyKicker}
            title={viewCopy.emptyTitle}
            description={viewCopy.emptyDescription}
            className="mx-auto max-w-2xl"
          >
            {isAuthenticated && !hasSearchQuery && !isViewingOwnerDecks ? (
              <ul className="mx-auto mb-6 grid max-w-md gap-2 text-left text-sm font-medium">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-neo-yellow font-display text-xs font-bold">
                    1
                  </span>
                  Make a focused set with five to ten cards.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-neo-teal font-display text-xs font-bold">
                    2
                  </span>
                  Study it once so recommendations have something to work with.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[2px] border-foreground bg-neo-magenta font-display text-xs font-bold">
                    3
                  </span>
                  Publish it when it is ready for other learners.
                </li>
              </ul>
            ) : null}
            <div className="flex flex-wrap justify-center gap-3">
              {hasSearchQuery || isViewingOwnerDecks ? (
                <Link href="/decks" className={stateActionClassName}>
                  <X className="h-4 w-4" />
                  Clear filters
                </Link>
              ) : null}
              {!isViewingOwnerDecks && isAuthenticated ? (
                <Link
                  href="/decks/editor/new"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  New deck
                </Link>
              ) : null}
              {!isAuthenticated && !isViewingOwnerDecks ? (
                <Link href={buildLoginRedirectPath('/decks')} className={stateActionClassName}>
                  <UserPlus className="h-4 w-4" />
                  Sign in to create
                </Link>
              ) : null}
            </div>
          </AppStatePanel>
        )}
      </section>
    </>
  );
}
