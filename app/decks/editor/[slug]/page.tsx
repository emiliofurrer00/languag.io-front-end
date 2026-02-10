import DeckEditorContainer from '@/components/create-form/DeckEditorContainer';

export type DeckDetails = {
  title: string;
  description: string;
  category: string;
  color: string;
  visibility: boolean;
  id?: string;
};

async function getDefaultDeckDetails(slug: string): Promise<DeckDetails> {
  if (slug === 'new') {
    return {
      title: '',
      description: '',
      category: '',
      color: 'teal',
      visibility: true,
    };
  }

  const deck: DeckDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks/${slug}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 30 }, // Revalidate every 30 seconds to keep data fresh
  }).then((res) => res.json());
  console.log('Fetched deck details:', deck);

  return {
    title: deck.title || '',
    description: deck.description || '',
    category: deck.category || '',
    color: deck.color || 'teal',
    visibility: deck.visibility, // Assuming visibility 0 means private
    id: deck.id,
  };
}

export default async function CreateDeckPage({ params }: any) {
  const { slug } = await params;
  const defaultData = await getDefaultDeckDetails(slug);

  return <DeckEditorContainer defaultDeckDetails={defaultData} />;
}
