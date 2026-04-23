'use client';

import { Check } from 'lucide-react';
import { NEO_COLOR_OPTIONS } from '@/lib/theme/neo-colors';
import { cn } from '@/lib/utils';

export default function DeckColors({
  selectedColor,
  onColorSelect,
}: {
  selectedColor: string;
  onColorSelect: (colorId: string) => void;
}) {
  return (
    <>
      <span className="text-sm font-bold mb-4">Deck Color</span>
      <div className="flex gap-3">
        {NEO_COLOR_OPTIONS.map((color) => (
          <button
            type="button"
            key={color.id}
            aria-label={`Use ${color.name} deck color`}
            aria-pressed={selectedColor === color.id}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              color.className,
              selectedColor === color.id
                ? 'translate-x-[1px] translate-y-[1px] shadow-[5px_5px_0_0_hsl(var(--foreground))]'
                : 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_hsl(var(--foreground))]'
            )}
            onClick={() => onColorSelect(color.id)}
          >
            <Check
              className={cn(
                'm-auto h-5 w-5 text-black transition-opacity',
                selectedColor === color.id ? 'opacity-100' : 'opacity-0'
              )}
            />
          </button>
        ))}
      </div>
    </>
  );
}
