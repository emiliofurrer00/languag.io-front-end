import DeckDetailPreview from '@/components/decks-list/DeckDetailPreview';
import { getDeckDetails } from '@/lib/decks/server';
import { notFound } from 'next/navigation';

type DeckDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DeckDetailPage({ params }: DeckDetailPageProps) {
  const { slug } = await params;
  let deck;

  try {
    deck = await getDeckDetails(slug);
  } catch {
    notFound();
  }

  return <DeckDetailPreview deck={{ ...deck, id: deck.id ?? slug }} />;
}
