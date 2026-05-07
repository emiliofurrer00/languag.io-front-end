import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Globe,
  Layers,
  ListChecks,
  Lock,
  Pencil,
  Play,
  Sparkles,
  User,
} from 'lucide-react';

import Navbar from './Navbar';
import { DeckDetails } from '@/lib/decks/types';
import { buildProfilePath } from '@/lib/profile/paths';
import { getNeoColorClass } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';

type DeckDetailPreviewProps = {
  deck: DeckDetails;
};

const primaryLinkClassName =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-primary px-4 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const secondaryLinkClassName =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-secondary px-4 font-display text-sm font-semibold text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function formatVisibility(visibility: number) {
  return visibility ? 'Public deck' : 'Private deck';
}

export default function DeckDetailPreview({ deck }: DeckDetailPreviewProps) {
  const cardCount = deck.cards?.length ?? 0;
  const previewCards = (deck.cards ?? []).slice(0, 6);
  const creatorLabel = deck.ownerName || deck.ownerUsername || 'Unknown creator';
  const creatorProfilePath = buildProfilePath(deck.ownerUsername ?? deck.ownerName);
  const canEdit = Boolean(deck.canEdit ?? deck.isOwner);
  const studyHref = deck.id ? `/study/${deck.id}` : '/decks';

  return (
    <>
      <Navbar title="Deck preview" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] lg:items-start">
          <div className="min-w-0">
            <Link
              href="/decks"
              className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to decks
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border-[2px] border-foreground bg-neo-yellow px-3 py-1 text-xs font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                {deck.visibility ? (
                  <Globe className="h-3.5 w-3.5" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
                {formatVisibility(deck.visibility)}
              </span>
              <span className="rounded-full border-[2px] border-foreground bg-secondary px-3 py-1 text-xs font-bold shadow-[3px_3px_0_0_hsl(var(--foreground))]">
                {deck.category || 'Uncategorized'}
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl text-balance font-display text-4xl font-bold leading-tight sm:text-5xl">
              {deck.title || 'Untitled deck'}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {deck.description || 'Preview the cards, then start a study run when you are ready.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Layers className="h-4 w-4 text-foreground" />
                {cardCount} {cardCount === 1 ? 'card' : 'cards'}
              </span>
              <span className="inline-flex min-w-0 items-center gap-2">
                <User className="h-4 w-4 shrink-0 text-foreground" />
                {creatorProfilePath ? (
                  <Link
                    href={creatorProfilePath}
                    className="truncate underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {creatorLabel}
                  </Link>
                ) : (
                  <span className="truncate">{creatorLabel}</span>
                )}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={studyHref} className={primaryLinkClassName}>
                <Play className="h-4 w-4 fill-foreground" />
                Study deck
              </Link>
              <Link href="/sagas" className={secondaryLinkClassName}>
                <Compass className="h-4 w-4" />
                Explore sagas
              </Link>
              {canEdit && deck.id ? (
                <Link href={`/decks/editor/${deck.id}`} className={secondaryLinkClassName}>
                  <Pencil className="h-4 w-4" />
                  Edit deck
                </Link>
              ) : null}
            </div>
          </div>

          <aside
            className={cn(
              'rounded-2xl border-[3px] border-foreground p-5 shadow-[6px_6px_0_0_hsl(var(--foreground))]',
              getNeoColorClass(deck.color)
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-70">
                  Study preview
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight">
                  Try the flow before you commit.
                </h2>
              </div>
              <BookOpen className="h-7 w-7 shrink-0" />
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-xl border-[2px] border-foreground bg-background/75 p-4">
                <p className="flex items-center gap-2 font-display text-xl font-bold">
                  <ListChecks className="h-5 w-5" />
                  {cardCount}
                </p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  prompts ready to review
                </p>
              </div>
              <div className="rounded-xl border-[2px] border-foreground bg-background/75 p-4">
                <p className="flex items-center gap-2 font-display text-xl font-bold">
                  <Sparkles className="h-5 w-5" />
                  Saved progress
                </p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  Sign in when you want history, due cards, and recommendations.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-12">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                Cards
              </p>
              <h2 className="font-display text-2xl font-bold">What you will study</h2>
            </div>
            {cardCount > previewCards.length ? (
              <span className="text-sm font-semibold text-muted-foreground">
                Showing {previewCards.length} of {cardCount}
              </span>
            ) : null}
          </div>

          {previewCards.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {previewCards.map((card, index) => (
                <article
                  key={card.id ?? `${card.frontText}-${index}`}
                  className="flex min-h-44 flex-col justify-between rounded-xl border-[2px] border-foreground bg-card p-5 shadow-[4px_4px_0_0_hsl(var(--foreground))]"
                >
                  <div>
                    <span className="rounded-full border-[2px] border-foreground bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                      Card {index + 1}
                    </span>
                    <p className="mt-4 line-clamp-3 font-display text-lg font-bold leading-tight">
                      {card.frontText || 'Untitled prompt'}
                    </p>
                  </div>
                  <p className="mt-4 line-clamp-2 border-t-[2px] border-foreground/15 pt-3 text-sm text-muted-foreground">
                    {card.backText || 'Answer will appear in study mode.'}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-[2px] border-foreground bg-card p-6 text-sm text-muted-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              This deck does not have studyable cards yet.
            </div>
          )}
        </section>
      </main>
    </>
  );
}
