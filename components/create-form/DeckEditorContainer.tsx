'use client';

import Navbar from '@/components/create-form/Navbar';
import DeckDetailsEdit from '@/components/create-form/DeckDetails';
import DeckPreview from '@/components/create-form/DeckPreview';
import CardsEditorContainer from '@/components/create-form/CardsEditorContainer';
import { saveDeck } from '@/lib/decks/client';
import { DeckDetails } from '@/lib/decks/types';
import { useState } from 'react';

type DeckEditorValidationErrors = {
  title?: string;
  cards?: string;
};

function validateDeck(deckDetails: DeckDetails): DeckEditorValidationErrors {
  const errors: DeckEditorValidationErrors = {};

  if (!deckDetails.title.trim()) {
    errors.title = 'Deck title is required.';
  }

  if ((deckDetails.cards ?? []).length === 0) {
    errors.cards = 'At least one card needs to be added.';
  }

  return errors;
}

export default function DeckEditorContainer({
  defaultDeckDetails,
}: {
  defaultDeckDetails: DeckDetails;
}) {
  const [deckDetails, setDeckDetails] = useState<DeckDetails>(defaultDeckDetails);
  const [validationErrors, setValidationErrors] = useState<DeckEditorValidationErrors>({});

  function handleDeckDetailsChange(nextDeckDetails: DeckDetails) {
    setDeckDetails(nextDeckDetails);

    if (nextDeckDetails.title.trim()) {
      setValidationErrors((currentErrors) => ({ ...currentErrors, title: undefined }));
    }
  }

  function handleCardsChange(newCards: DeckDetails['cards']) {
    setDeckDetails((currentDeckDetails) => ({ ...currentDeckDetails, cards: newCards }));

    if (newCards.length > 0) {
      setValidationErrors((currentErrors) => ({ ...currentErrors, cards: undefined }));
    }
  }

  async function handleSave(submitNewDeck: boolean) {
    const nextValidationErrors = validateDeck(deckDetails);

    if (Object.keys(nextValidationErrors).length > 0) {
      setValidationErrors(nextValidationErrors);
      return false;
    }

    return saveDeck({
      deck: {
        ...deckDetails,
        title: deckDetails.title.trim(),
      },
      isNew: submitNewDeck,
    });
  }

  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar handleSave={handleSave} isEditMode={Boolean(defaultDeckDetails.id)} />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-10 md:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <div className="flex flex-col gap-4">
          <DeckDetailsEdit
            deckDetails={deckDetails}
            setDeckDetails={handleDeckDetailsChange}
            titleError={validationErrors.title}
          />
          <CardsEditorContainer
            cards={deckDetails.cards || []}
            setCards={handleCardsChange}
            errorMessage={validationErrors.cards}
          />
        </div>
        <DeckPreview deckDetails={deckDetails} />
      </section>
    </div>
  );
}
