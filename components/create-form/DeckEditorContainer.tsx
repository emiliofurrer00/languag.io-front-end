'use client';

import Navbar from '@/components/create-form/Navbar';
import DeckDetailsEdit from '@/components/create-form/DeckDetails';
import DeckPreview from '@/components/create-form/DeckPreview';
import { useState } from 'react';
import { DeckDetails } from '@/app/decks/editor/[slug]/page';

export default function DeckEditorContainer({
  defaultDeckDetails,
}: {
  defaultDeckDetails: DeckDetails;
}) {
  const [deckDetails, setDeckDetails] = useState<DeckDetails>(defaultDeckDetails);

  function handleSave(submitNewDeck: boolean) {
    console.log('Saving deck with details:', deckDetails);
    const payload = {
      title: deckDetails.title,
      description: deckDetails.description,
      category: deckDetails.category,
      color: deckDetails.color,
      visibility: deckDetails.visibility ? 0 : 1, // Assuming the API expects 0 for private and 1 for public
    };
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decks${submitNewDeck ? '' : `/${defaultDeckDetails.id}`}`,
      {
        method: submitNewDeck ? 'POST' : 'PUT', // Use POST for new decks and PUT for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('Deck saved successfully:', data);
        // Optionally, redirect to the deck page or show a success message
      })
      .catch((error) => {
        console.error('Error saving deck:', error);
        // Optionally, show an error message to the user
      });
  }
  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar handleSave={handleSave} isEditMode={Boolean(defaultDeckDetails.id)} />
      <section className="px-3 md:grid-cols-[2fr_1fr] grid gap-6">
        <DeckDetailsEdit deckDetails={deckDetails} setDeckDetails={setDeckDetails} />
        <DeckPreview deckDetails={deckDetails} />
      </section>
    </div>
  );
}
