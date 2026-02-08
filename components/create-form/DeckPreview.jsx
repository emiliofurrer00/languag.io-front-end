import { Globe, Layers, Lock } from 'lucide-react';

export default function DeckPreview({ deckDetails }) {
  return (
    <div className="py-3">
      <h2 className="text-lg font-bold mt-5 mb-3">Preview</h2>
      <div
        className={`flex border-3 rounded-xl bg-neo-${deckDetails.color} shadow-[5px_5px_0_0_hsl(var(--foreground))] p-5`}
      >
        <div className="flex flex-col gap-2 justify-center w-full pl-3">
          <div className="w-full flex justify-end">
            {deckDetails.isPrivate ? (
              <Lock className="text-black/60 w-5 h-5"></Lock>
            ) : (
              <Globe className="text-black/60 w-5 h-5"></Globe>
            )}
          </div>
          <span className="font-bold text-2xl pt-2">{deckDetails.title || 'Untitled Deck'}</span>
          <span className="text-sm">
            {deckDetails.description || 'No description provided yet...'}
          </span>
          <span className="pb-2 mt-2 text-sm font-semibold">
            <Layers className="inline mr-2 w-4   h-4"></Layers>0 Cards
          </span>
        </div>
      </div>
    </div>
  );
}
