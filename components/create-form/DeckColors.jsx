'use client';

import { Check } from 'lucide-react';

const colors = [
  { name: 'Teal', class: 'bg-neo-teal', id: 'teal' },
  { name: 'Blue', class: 'bg-neo-blue', id: 'blue' },
  { name: 'Coral', class: 'bg-neo-coral', id: 'coral' },
  { name: 'Magenta', class: 'bg-neo-magenta', id: 'magenta' },
  { name: 'Yellow', class: 'bg-neo-yellow', id: 'yellow' },
];

export default function DeckColors({ selectedColor, onColorSelect }) {
  return (
    <>
      <span className="text-sm font-bold mb-4">Deck Color</span>
      <div className="flex gap-3">
        {colors.map((color) => (
          <div
            key={color.id}
            className={`flex justify-center items-center hover:h-12.5 hover:w-12.5 cursor-pointer w-12 h-12 border-3 rounded-xl shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all ${color.class} ${selectedColor === color.id ? 'w-13 h-13 shadow-[4px_4px_0_0_hsl(var(--foreground))]' : ''}`}
            onClick={() => onColorSelect(color.id)}
          >
            <Check
              className={`text-black w-5 h-5 m-auto ${selectedColor === color.id ? 'block' : 'hidden'}`}
            ></Check>
          </div>
        ))}
      </div>
    </>
  );
}
