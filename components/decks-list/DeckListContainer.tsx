import DeckCard from './DeckCard';
import DeckFilters from './DeckFilters';
import Navbar from './Navbar';
import { DeckSummary } from '@/lib/decks/types';
import { NeoCard } from '@/components/ui/NeoCard';
import { Layers, Plus, X } from 'lucide-react';
import Link from 'next/link';

type DeckListFilters = {
  searchQuery?: string;
  ownerUsername?: string;
};

type DeckListContainerProps = {
  decks: DeckSummary[];
  filters?: DeckListFilters;
};

const secondaryActionClassName =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-secondary px-4 font-display text-sm font-semibold text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export default function DeskListContainer({ decks, filters }: DeckListContainerProps) {
  const searchQuery = filters?.searchQuery ?? '';
  const ownerUsername = filters?.ownerUsername?.trim();
  const isViewingOwnerDecks = Boolean(ownerUsername);
  const hasSearchQuery = Boolean(searchQuery.trim());
  // TODO: Move this / refactor into a utility function to keep the component cleaner and more focused on presentation logic
  const title = ownerUsername ? `@${ownerUsername}'s Public Decks` : 'Your Decks';
  const description = ownerUsername
    ? 'Browse public decks shared by this creator.'
    : 'Pick a deck to study, or create a fresh one from scratch.';
  const emptyTitle = isViewingOwnerDecks
    ? 'No public decks found'
    : hasSearchQuery
      ? 'No decks match your search'
      : 'Create your first deck';
  const emptyDescription = isViewingOwnerDecks
    ? 'Try a different search, or clear the creator filter to browse your decks.'
    : hasSearchQuery
      ? 'Try a different search, or clear the filter to see your full list.'
      : 'Start with a few cards. You can keep it private while it is still rough.';

  return (
    <>
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 pb-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border-[2px] border-foreground bg-secondary px-3 py-1 text-sm font-semibold shadow-[3px_3px_0_0_hsl(var(--foreground))]">
            <Layers className="h-4 w-4" />
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
          </span>
        </div>

        <DeckFilters searchQuery={searchQuery} ownerUsername={ownerUsername} />

        {decks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deckData={deck} />
            ))}
          </div>
        ) : (
          <NeoCard className="mx-auto max-w-xl p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-[2px] border-foreground bg-primary shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <Plus className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">{emptyTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{emptyDescription}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {hasSearchQuery || isViewingOwnerDecks ? (
                <Link href="/decks" className={secondaryActionClassName}>
                  <X className="h-4 w-4" />
                  Clear filters
                </Link>
              ) : null}
              {!isViewingOwnerDecks ? (
                <Link
                  href="/decks/editor/new"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-primary px-4 py-2 font-display font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  New Deck
                </Link>
              ) : null}
            </div>
          </NeoCard>
        )}
      </section>
    </>
  );
}
