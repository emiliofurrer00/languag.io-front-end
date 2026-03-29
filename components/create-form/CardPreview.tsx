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
    <div
      className="group flex items-center gap-3 p-4 bg-card rounded-xl border-2 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
    >
      {/* Drag Handle */}
      <div className="cursor-grab text-muted-foreground hover:text-foreground transition-colors">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Card Number */}
      <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground flex items-center justify-center font-display font-bold text-sm">
        {index + 1}
      </div>

      {/* Card Content Preview */}
      <div className="flex-1 min-w-0 grid grid-cols-2 gap-4">
        <div className="truncate">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Front</span>
          <p className="font-medium truncate">{card.frontText}</p>
        </div>
        <div className="truncate">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Back</span>
          <p className="font-medium truncate">{card.backText}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(card)}
          className="p-2 hover:bg-neo-blue rounded-lg transition-colors border-2 border-transparent hover:border-foreground cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors border-2 border-transparent hover:border-foreground cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
