import { Globe, Layers, Lightbulb, Lock } from 'lucide-react';
import { DeckDetails } from '@/lib/decks/types';
import { getNeoColorClass } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';

export default function DeckPreview({ deckDetails }: { deckDetails: DeckDetails }) {
  const cardCount = deckDetails.cards?.length ?? 0;
  const isPublic = Boolean(deckDetails.visibility);

  return (
    <div className="pb-3 md:sticky md:top-28">
      <h2 className="mb-3 text-lg font-bold">Preview</h2>
      <div
        className={cn(
          'flex min-h-56 rounded-xl border-[3px] border-foreground p-5 shadow-[5px_5px_0_0_hsl(var(--foreground))]',
          getNeoColorClass(deckDetails.color)
        )}
      >
        <div className="flex w-full flex-col justify-center gap-2 pl-3">
          <div className="flex w-full justify-end">
            {isPublic ? (
              <Globe className="h-5 w-5 text-black/60" />
            ) : (
              <Lock className="h-5 w-5 text-black/60" />
            )}
          </div>
          <span className="line-clamp-2 pt-2 text-2xl font-bold">
            {deckDetails.title || 'Untitled Deck'}
          </span>
          <span className="line-clamp-3 text-sm">
            {deckDetails.description || 'No description provided yet...'}
          </span>
          <span className="mt-2 pb-2 text-sm font-semibold">
            <Layers className="mr-2 inline h-4 w-4" />
            {cardCount} {cardCount === 1 ? 'Card' : 'Cards'}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border-2 border-foreground bg-muted p-4">
        <h4 className="mb-2 flex items-center gap-2 font-display font-semibold">
          <Lightbulb className="h-4 w-4" />
          Tips
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Keep each card focused on one concept.</li>
          <li>Put the prompt on the front and the answer on the back.</li>
          <li>Public decks can be discovered by other learners.</li>
        </ul>
      </div>
    </div>
  );
}
