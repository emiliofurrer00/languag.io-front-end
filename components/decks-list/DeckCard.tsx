import { Globe, Layers, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { DeckSummary } from '@/lib/decks/types';

export default function DeckCard({
  deckData,
}: {
  deckData: DeckSummary;
}) {
  const viewMode = 'grid'; // will be toggable in UI later on
  const { title, description, category, color, visibility, id, cards } = deckData;
  return (
    <div
      className={`hover:translate-0.5 transition-all duration-50 flex-1 border-3 w-full bg-neo-${color} bg-card rounded-xl hover:shadow-[4px_4px_0_0_hsl(var(--foreground))] shadow-[5px_5px_0_0_hsl(var(--foreground))] p-6 flex flex-col justify-between`}
    >
      <Link href={`/study/${id}`} key={id}>
        <div className="flex justify-between mb-3">
          <span className="px-3 py-1 bg-background/80 rounded-full text-xs font-semibold border-[2px] border-foreground">
            {category}
          </span>
          {visibility ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </div>
        <h4 className="font-display font-bold text-xl mb-2">{title}</h4>
        {viewMode === 'grid' && <p className="text-sm mb-4 line-clamp-2">{description}</p>}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span className="font-semibold">
              {cards.length || 0} {cards.length === 1 ? 'card' : 'cards'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Emilio</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
