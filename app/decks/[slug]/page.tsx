import type { Metadata } from 'next';
import DeckDetailPreview from '@/components/decks-list/DeckDetailPreview';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDeckDetails } from '@/lib/decks/server';
import { buildAbsoluteUrl, createNoIndexMetadata, createPageMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';

type DeckDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: DeckDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const deck = await getDeckDetails(slug);
    const cardCount = deck.cards?.length ?? 0;
    const title = `${deck.title || 'Untitled deck'} flashcards`;
    const categoryLabel = deck.category ? ` in ${deck.category}` : '';
    const fallbackDescription = `Study ${cardCount} ${cardCount === 1 ? 'card' : 'cards'}${categoryLabel} with this public Languag.io deck.`;

    return createPageMetadata({
      title,
      description: deck.description || fallbackDescription,
      path: `/decks/${encodeURIComponent(deck.id ?? slug)}`,
      type: 'article',
    });
  } catch {
    return createNoIndexMetadata('Deck not found');
  }
}

export default async function DeckDetailPage({ params }: DeckDetailPageProps) {
  const { slug } = await params;
  let deck;

  try {
    deck = await getDeckDetails(slug);
  } catch {
    notFound();
  }

  const deckId = deck.id ?? slug;
  const deckUrl = buildAbsoluteUrl(`/decks/${encodeURIComponent(deckId)}`);
  const cardCount = deck.cards?.length ?? 0;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: deck.title || 'Untitled deck',
          description:
            deck.description ||
            `Study ${cardCount} ${cardCount === 1 ? 'card' : 'cards'} with this Languag.io deck.`,
          url: deckUrl,
          learningResourceType: 'Flashcard deck',
          educationalUse: 'Practice',
          numberOfItems: cardCount,
          about: deck.category || undefined,
          creator: deck.ownerName
            ? {
                '@type': 'Person',
                name: deck.ownerName,
              }
            : undefined,
        }}
      />
      <DeckDetailPreview deck={{ ...deck, id: deckId }} />
    </>
  );
}
