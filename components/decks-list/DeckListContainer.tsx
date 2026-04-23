import DeckCard from './DeckCard';
import Navbar from './Navbar';
import { DeckSummary } from '@/lib/decks/types';
import { NeoCard } from '@/components/ui/NeoCard';
import { Layers, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DeskListContainer({ decks }: { decks: DeckSummary[] }) {
  return (
    <>
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 pb-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Your Decks</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a deck to study, or create a fresh one from scratch.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border-[2px] border-foreground bg-secondary px-3 py-1 text-sm font-semibold shadow-[3px_3px_0_0_hsl(var(--foreground))]">
            <Layers className="h-4 w-4" />
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
          </span>
        </div>

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
            <h2 className="mt-5 font-display text-2xl font-bold">Create your first deck</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with a few cards. You can keep it private while it is still rough.
            </p>
            <Link
              href="/decks/editor/new"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-primary px-4 py-2 font-display font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              New Deck
            </Link>
          </NeoCard>
        )}
      </section>
    </>
  );
}
