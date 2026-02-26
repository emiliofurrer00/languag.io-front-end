import DeckEditorContainer from '@/components/create-form/DeckEditorContainer';

export type DeckDetails = {
  title: string;
  description: string;
  category: string;
  color: string;
  visibility: number;
  id?: string;
  cards: {
    frontText: string;
    backText: string;
  }[];
};

export async function getDefaultDeckDetails(slug: string): Promise<DeckDetails> {
  if (slug === 'new') {
    return {
      title: '',
      description: '',
      category: '',
      color: 'teal',
      visibility: 1,
      cards: [],
    };
  }

  const deck: DeckDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks/${slug}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  }).then((res) => res.json());
  console.log('Fetched deck details:', deck);

  return {
    title: deck.title || '',
    description: deck.description || '',
    category: deck.category || '',
    color: deck.color || 'teal',
    visibility: deck.visibility, // Assuming visibility 0 means private
    id: deck.id,
    cards: deck.cards || [],
  };
}

export default async function CreateDeckPage({ params }: any) {
  const { slug } = await params;
  const defaultData = await getDefaultDeckDetails(slug);

  return <DeckEditorContainer defaultDeckDetails={defaultData} />;
}
