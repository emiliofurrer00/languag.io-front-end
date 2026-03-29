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

  return (
    <div className="mt-4 p-4 bg-neo-black/10 rounded-xl border-2 border-foreground">
      <h4 className="font-display font-semibold mb-2">{isNewCard ? 'New Card' : 'Edit Card'}</h4>
      <div className="flex flex-col gap-3">
        <input
          value={frontText}
          type="text"
          className="font-normal block w-full rounded-md border-2 border-foreground px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Front side (e.g., 'What is the capital of France?')"
          onChange={(e) => setFrontText(e.target.value)}
        />
        <input
          value={backText}
          type="text"
          className="font-normal block w-full rounded-md border-2 border-foreground px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Back side (e.g., 'Paris')"
          onChange={(e) => setBackText(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <NeoButton variant="outline" size="sm" onClick={handleCloseEditor}>
            Cancel
          </NeoButton>
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => {
              if (isNewCard) {
                setCards([...cards, { frontText, backText }]);
              } else {
                const updatedCards = [...cards];
                updatedCards[editingCardIndex] = {
                  frontText,
                  backText,
                };
                setCards(updatedCards);
              }
              setFrontText('');
              setBackText('');
              handleCloseEditor();
            }}
            className="cursor-pointer"
          >
            {isNewCard ? 'Add Card' : 'Save Changes'}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
