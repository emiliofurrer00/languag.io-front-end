import { useState } from 'react';
import { NeoButton } from '../ui/NeoButton';
import { DeckCard } from '@/lib/decks/types';

type CardsEditorProps = {
  cards: DeckCard[];
  setCards: (newCards: DeckCard[]) => void;
  handleCloseEditor: () => void;
  editingCardIndex: number | null;
};

function getDefaultCard(editingCardIndex: number | null, cards: DeckCard[]) {
  if (editingCardIndex === null) {
    return { frontText: '', backText: '' };
  }
  return cards[editingCardIndex] || { frontText: '', backText: '' };
}

export default function CardsEditor({
  cards,
  setCards,
  handleCloseEditor,
  editingCardIndex,
}: CardsEditorProps) {
  const defaultData = getDefaultCard(editingCardIndex, cards);
  const isNewCard = editingCardIndex === null;

  const [frontText, setFrontText] = useState(defaultData.frontText);
  const [backText, setBackText] = useState(defaultData.backText);
  const trimmedFrontText = frontText.trim();
  const trimmedBackText = backText.trim();
  const canSave = trimmedFrontText.length > 0 && trimmedBackText.length > 0;

  return (
    <div className="mt-4 p-4 bg-neo-black/10 rounded-xl border-2 border-foreground">
      <h4 className="font-display font-semibold mb-2">{isNewCard ? 'New Card' : 'Edit Card'}</h4>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold" htmlFor="card-front-text">
          Front
          <input
            id="card-front-text"
            value={frontText}
            type="text"
            className="mt-1 block w-full rounded-md border-2 border-foreground bg-background px-3 py-2 font-normal shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="What is the capital of France?"
            onChange={(e) => setFrontText(e.target.value)}
            required
          />
        </label>
        <label className="text-sm font-bold" htmlFor="card-back-text">
          Back
          <input
            id="card-back-text"
            value={backText}
            type="text"
            className="mt-1 block w-full rounded-md border-2 border-foreground bg-background px-3 py-2 font-normal shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Paris"
            onChange={(e) => setBackText(e.target.value)}
            required
          />
        </label>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <NeoButton variant="outline" size="sm" onClick={handleCloseEditor}>
            Cancel
          </NeoButton>
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => {
              if (!canSave) {
                return;
              }

              if (isNewCard) {
                setCards([...cards, { frontText: trimmedFrontText, backText: trimmedBackText }]);
              } else {
                const updatedCards = [...cards];
                updatedCards[editingCardIndex] = {
                  ...updatedCards[editingCardIndex],
                  frontText: trimmedFrontText,
                  backText: trimmedBackText,
                };
                setCards(updatedCards);
              }
              setFrontText('');
              setBackText('');
              handleCloseEditor();
            }}
            disabled={!canSave}
            className="cursor-pointer"
          >
            {isNewCard ? 'Add Card' : 'Save Changes'}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
