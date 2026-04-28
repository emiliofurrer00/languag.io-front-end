'use client';

import Navbar from '@/components/create-form/Navbar';
import DeckDetailsEdit from '@/components/create-form/DeckDetails';
import DeckPreview from '@/components/create-form/DeckPreview';
import CardsEditorContainer from '@/components/create-form/CardsEditorContainer';
import { NeoButton } from '@/components/ui/NeoButton';
import { saveDeck } from '@/lib/decks/client';
import { DeckDetails } from '@/lib/decks/types';
import { cn } from '@/lib/utils';
import { FileText, Layers } from 'lucide-react';
import { useState } from 'react';

type DeckEditorTab = 'details' | 'cards';

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
  const [activeTab, setActiveTab] = useState<DeckEditorTab>('details');
  const [validationErrors, setValidationErrors] = useState<DeckEditorValidationErrors>({});
  const cardCount = deckDetails.cards?.length ?? 0;
  const detailsValid = Boolean(deckDetails.title.trim());
  const tabs: Array<{
    key: DeckEditorTab;
    label: string;
    icon: typeof FileText;
    badge?: string;
  }> = [
    { key: 'details', label: 'Deck Details', icon: FileText },
    { key: 'cards', label: 'Cards', icon: Layers, badge: String(cardCount) },
  ];

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
      setActiveTab(nextValidationErrors.title ? 'details' : 'cards');
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
          <div
            role="tablist"
            aria-label="Deck editor sections"
            className="inline-flex w-full gap-2 rounded-2xl border-[3px] border-foreground bg-card p-1.5 shadow-[4px_4px_0_0_hsl(var(--foreground))] sm:w-fit"
          >
            {tabs.map(({ key, label, icon: Icon, badge }) => {
              const isActive = activeTab === key;

              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`deck-editor-panel-${key}`}
                  id={`deck-editor-tab-${key}`}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl border-[2px] px-4 py-2.5 font-display text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 sm:flex-none',
                    isActive
                      ? 'border-foreground bg-neo-yellow shadow-[3px_3px_0_0_hsl(var(--foreground))]'
                      : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {badge ? (
                    <span
                      className={cn(
                        'ml-1 inline-flex h-5 min-w-[22px] items-center justify-center rounded-full border-[2px] border-foreground px-1.5 text-xs font-bold',
                        isActive ? 'bg-background' : 'bg-muted'
                      )}
                    >
                      {badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {activeTab === 'details' ? (
            <div
              id="deck-editor-panel-details"
              role="tabpanel"
              aria-labelledby="deck-editor-tab-details"
              className="flex flex-col gap-4"
            >
              <DeckDetailsEdit
                deckDetails={deckDetails}
                setDeckDetails={handleDeckDetailsChange}
                titleError={validationErrors.title}
              />
              <div className="flex justify-end">
                <NeoButton
                  variant="accent"
                  size="sm"
                  onClick={() => setActiveTab('cards')}
                  disabled={!detailsValid}
                >
                  Continue to Cards
                  <Layers className="h-4 w-4" />
                </NeoButton>
              </div>
            </div>
          ) : null}

          {activeTab === 'cards' ? (
            <div
              id="deck-editor-panel-cards"
              role="tabpanel"
              aria-labelledby="deck-editor-tab-cards"
            >
              <CardsEditorContainer
                cards={deckDetails.cards || []}
                setCards={handleCardsChange}
                errorMessage={validationErrors.cards}
              />
            </div>
          ) : null}
        </div>
        <DeckPreview deckDetails={deckDetails} />
      </section>
    </div>
  );
}
