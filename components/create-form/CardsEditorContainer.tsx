import { Plus } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import { useState } from 'react';
import CardPreview from './CardPreview';
import CardsEditor from './CardsEditor';

export default function CardsEditorContainer({
  cards,
  setCards,
}: {
  cards: any[];
  setCards: (newCards: any[]) => void;
}) {
  const [isEditCardMode, setIsEditCardMode] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  function handleCloseEditor() {
    setIsEditCardMode(false);
    setEditingCardIndex(null);
  }

  return (
    <div className="border-3 rounded-lg shadow-[5px_5px_0_0_hsl(var(--foreground))] p-5">
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold mb-1">Cards</h2>
          <span className="text-sm text-gray-600">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'} in this deck.
          </span>
        </div>
        <NeoButton
          className={
            isEditCardMode
              ? 'hidden'
              : 'h-12 text-sm py-0 px-3 cursor-pointer bg-neo-magenta hover:bg-neo-magenta/90'
          }
          variant="primary"
          size="sm"
          onClick={() => setIsEditCardMode(true)}
        >
          <Plus></Plus>Add Card
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
          {cards.map((card, index) => (
            <CardPreview
              key={index}
              card={card}
              index={index}
              onEdit={() => {
                setIsEditCardMode(true);
                setEditingCardIndex(index);
              }}
              onDelete={() => {
                setCards(cards.filter((c, i) => i !== index));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
