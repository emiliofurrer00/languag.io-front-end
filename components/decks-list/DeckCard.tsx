import { Globe, Layers, User, Lock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { DeckSummary } from '@/lib/decks/types';
import { buildProfilePath } from '@/lib/profile/paths';
import { getNeoColorClass } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';
import { NeoButton } from '../ui/NeoButton';

export default function DeckCard({ deckData }: { deckData: DeckSummary }) {
  const { title, description, category, color, visibility, cards } = deckData;
  const cardCount = cards?.length ?? 0;
  const isPublic = Boolean(visibility);
  const creatorLabel = deckData.ownerName || deckData.ownerUsername || 'Unknown creator';
  const creatorProfilePath = buildProfilePath(deckData.ownerUsername ?? deckData.ownerName);

  return (
    <div
      aria-label={`Study ${title || 'Untitled deck'}`}
      className={cn(
        'group flex min-h-64 w-full flex-col justify-between rounded-xl border-[3px] border-foreground p-6 shadow-[5px_5px_0_0_hsl(var(--foreground))] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
        getNeoColorClass(color)
      )}
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="max-w-[12rem] truncate rounded-full border-[2px] border-foreground bg-background/80 px-3 py-1 text-xs font-semibold">
            {category || 'Uncategorized'}
          </span>
          <span
            aria-label={isPublic ? 'Public deck' : 'Private deck'}
            title={isPublic ? 'Public' : 'Private'}
          >
            {isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </span>
        </div>
        <h4 className="mb-2 line-clamp-2 font-display text-xl font-bold">
          {title || 'Untitled Deck'}
        </h4>
        <p className="mb-4 line-clamp-3 text-sm">{description || 'No description provided yet.'}</p>
      </div>

      <div className="mt-auto grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 shrink-0" />
          <span className="font-semibold">
            {cardCount} {cardCount === 1 ? 'card' : 'cards'}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <User className="h-4 w-4 shrink-0" />
          {creatorProfilePath ? (
            <Link
              href={creatorProfilePath}
              className="truncate font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            >
              {creatorLabel}
            </Link>
          ) : (
            <span className="truncate">{creatorLabel}</span>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 w-full justify-between">
          <Link href={`/study/${deckData.id}`} className="flex-1">
            <NeoButton variant="dark" size="sm" className="w-full">
              <BookOpen className="w-4 h-4" />
              Study
            </NeoButton>
          </Link>
          <Link href={`/decks/editor/${deckData.id}`} className="flex-1">
            <NeoButton variant="outline" size="sm" className="w-full bg-background/80">
              Edit
            </NeoButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
