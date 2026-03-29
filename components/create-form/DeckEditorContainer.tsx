'use client';

import Navbar from '@/components/create-form/Navbar';
import DeckDetailsEdit from '@/components/create-form/DeckDetails';
import DeckPreview from '@/components/create-form/DeckPreview';
import CardsEditorContainer from '@/components/create-form/CardsEditorContainer';
import { saveDeck } from '@/lib/decks/client';
import { DeckDetails } from '@/lib/decks/types';
import { useState } from 'react';

export default function DeckEditorContainer({
  defaultDeckDetails,
}: {
  defaultDeckDetails: DeckDetails;
}) {
  const [deckDetails, setDeckDetails] = useState<DeckDetails>(defaultDeckDetails);

  async function handleSave(submitNewDeck: boolean) {
    return saveDeck({
      deck: deckDetails,
      isNew: submitNewDeck,
    });
  }

  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar handleSave={handleSave} isEditMode={Boolean(defaultDeckDetails.id)} />
      <section className="px-3 md:grid-cols-[2fr_1fr] grid gap-6">
        <div className="flex flex-col gap-4">
          <DeckDetailsEdit deckDetails={deckDetails} setDeckDetails={setDeckDetails} />
          <CardsEditorContainer
            cards={deckDetails.cards || []}
            setCards={(newCards) => setDeckDetails({ ...deckDetails, cards: newCards })}
          />
        </div>
        <DeckPreview deckDetails={deckDetails} />
      </section>
    </div>
  );
}
