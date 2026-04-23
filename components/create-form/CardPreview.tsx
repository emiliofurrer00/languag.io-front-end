import { Edit2, GripVertical, Trash2 } from 'lucide-react';
import { DeckCard } from '@/lib/decks/types';

type CardPreviewProps = {
  card: DeckCard;
  index: number;
  onEdit?: (card: DeckCard) => void;
  onDelete?: () => void;
};

export default function CardPreview({
  card,
  index,
  onEdit = () => {},
  onDelete = () => {},
}: CardPreviewProps) {
  return (
    <div className="group flex items-center gap-3 p-4 bg-card rounded-xl border-2 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
      <div
        className="cursor-grab text-muted-foreground transition-colors hover:text-foreground"
        aria-hidden="true"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground flex items-center justify-center font-display font-bold text-sm">
        {index + 1}
      </div>

      <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="truncate">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Front</span>
          <p className="truncate font-medium">{card.frontText}</p>
        </div>
        <div className="truncate">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Back</span>
          <p className="truncate font-medium">{card.backText}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(card)}
          aria-label={`Edit card ${index + 1}`}
          className="p-2 hover:bg-neo-blue rounded-lg transition-colors border-2 border-transparent hover:border-foreground cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete card ${index + 1}`}
          className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors border-2 border-transparent hover:border-foreground cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
