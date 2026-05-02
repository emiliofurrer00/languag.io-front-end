import { CheckCircle2, Edit2, GripVertical, HelpCircle, Layers, Trash2 } from 'lucide-react';
import { DeckCard } from '@/lib/decks/types';
import { cn } from '@/lib/utils';

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
  const cardType = card.type ?? 'flashcard';
  const choices = [...(card.choices || [])].sort((a, b) => a.order - b.order);
  const correctChoice = choices.find((choice) => choice.isCorrect);

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

      <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-4">
        <div className="truncate">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {cardType === 'multi-choice' ? 'Question' : 'Front'}
          </span>
          <p className="truncate font-medium">{card.frontText}</p>
        </div>
        <div className="truncate">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {cardType === 'multi-choice' ? 'Correct Answer' : 'Back'}
          </span>
          <p className="truncate font-medium">
            {cardType === 'multi-choice' ? correctChoice?.text || card.backText : card.backText}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border-[2px] border-foreground px-2.5 py-1 text-xs font-bold',
              cardType === 'multi-choice' ? 'bg-neo-teal' : 'bg-neo-yellow'
            )}
          >
            {cardType === 'multi-choice' ? (
              <HelpCircle className="h-3.5 w-3.5" />
            ) : (
              <Layers className="h-3.5 w-3.5" />
            )}
            {cardType === 'multi-choice' ? 'Choice' : 'Flash'}
          </span>
          {cardType === 'multi-choice' ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {choices.length}
            </span>
          ) : null}
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
