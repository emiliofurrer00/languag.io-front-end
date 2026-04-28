import { Plus } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import { useState } from 'react';
import CardPreview from './CardPreview';
import CardsEditor from './CardsEditor';
import { DeckCard } from '@/lib/decks/types';

export default function CardsEditorContainer({
  cards,
  setCards,
  errorMessage,
}: {
  cards: DeckCard[];
  setCards: (newCards: DeckCard[]) => void;
  errorMessage?: string;
}) {
  const [isEditCardMode, setIsEditCardMode] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  function handleCloseEditor() {
    setIsEditCardMode(false);
    setEditingCardIndex(null);
  }

  function handleCreateCard() {
    setEditingCardIndex(null);
    setIsEditCardMode(true);
  }

  return (
    <div
      className={`rounded-lg border-3 p-5 shadow-[5px_5px_0_0_hsl(var(--foreground))] ${
        errorMessage ? 'border-destructive' : 'border-foreground'
      }`}
    >
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold mb-1">Cards</h2>
          <span className="text-sm text-gray-600">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'} in this deck.
          </span>
          {errorMessage ? (
            <p className="mt-2 text-sm font-semibold text-destructive">{errorMessage}</p>
          ) : null}
        </div>
        <NeoButton
          className={
            isEditCardMode
              ? 'hidden'
              : 'h-12 text-sm py-0 px-3 cursor-pointer bg-neo-magenta hover:bg-neo-magenta/90'
          }
          variant="primary"
          size="sm"
          onClick={handleCreateCard}
        >
          <Plus className="h-4 w-4" />
          Add Card
        </NeoButton>
      </div>
      {isEditCardMode ? (
        <CardsEditor
          cards={cards}
          setCards={setCards}
          handleCloseEditor={handleCloseEditor}
          editingCardIndex={editingCardIndex}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <CardPreview
                key={card.id ?? index}
                card={card}
                index={index}
                onEdit={() => {
                  setIsEditCardMode(true);
                  setEditingCardIndex(index);
                }}
                onDelete={() => {
                  setCards(cards.filter((_, i) => i !== index));
                }}
              />
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-foreground/40 bg-secondary/60 p-6 text-center">
              <p className="font-display text-base font-bold">No cards yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a prompt and answer when you are ready to start building this deck.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
