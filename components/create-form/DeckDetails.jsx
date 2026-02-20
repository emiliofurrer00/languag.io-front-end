'use client';

import { Globe, LockIcon } from 'lucide-react';
import DeckColors from './DeckColors';
import { Switch } from '../ui/Switch';

const CATEGORIES = [
  'Language',
  'Science',
  'Mathematics',
  'History',
  'Geography',
  'Art',
  'Music',
  'Literature',
  'Technology',
  'Sports',
];

export default function DeckDetails({ deckDetails, setDeckDetails }) {
  const { title, description, category, color, visibility } = deckDetails;
  return (
    <div className="border-3 rounded-lg shadow-[5px_5px_0_0_hsl(var(--foreground))] p-5">
      <h2 className="text-lg font-bold mb-5">Deck Details</h2>
      <div className="flex flex-col gap-5">
        <label className="text-sm font-bold">
          Deck Title *
          <input
            type="text"
            className="font-normal mt-1 block w-full rounded-md border-2 border-foreground px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="e.g., Spanish Basics"
            onChange={(e) => setDeckDetails({ ...deckDetails, title: e.target.value })}
            defaultValue={title}
          />
        </label>
        <label className="text-sm font-bold">
          Description
          <textarea
            className="font-normal mt-1 block w-full rounded-md h-24 border-2 border-foreground px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="A brief description of your deck."
            onChange={(e) => setDeckDetails({ ...deckDetails, description: e.target.value })}
            defaultValue={description}
          />
        </label>
        <label className="text-sm font-bold">
          Category
          <CategorySelect
            defaultValue={category}
            onChange={(e) => setDeckDetails({ ...deckDetails, category: e.target.value })}
          />
        </label>
        <div className="h-20">
          <DeckColors
            selectedColor={color}
            onColorSelect={(color) => setDeckDetails({ ...deckDetails, color })}
          />
        </div>
        <div className="flex items-center justify-between bg-neo-black/10 py-5 px-5 border-3 rounded gap-4">
          <div className="flex items-center gap-3">
            <div>
              {visibility ? (
                <LockIcon className="text-black/60 w-5 h-5"></LockIcon>
              ) : (
                <Globe className="text-neo-teal w-5 h-5"></Globe>
              )}
            </div>
            <div>
              <span className="text-md font-bold mb-4">
                {!visibility ? 'Private Deck' : 'Public Deck'}
              </span>
              <p className="text-black/50 text-sm">
                {!visibility ? 'Only you can see this deck.' : 'Everyone can see this deck.'}
              </p>
            </div>
          </div>
          <div>
            <Switch
              checked={visibility === 1}
              onCheckedChange={(visibility) =>
                setDeckDetails({ ...deckDetails, visibility: visibility ? 1 : 0 })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySelect({ defaultValue, onChange }) {
  return (
    <select
      className="font-normal mt-1 block w-fit rounded-md border-2 border-foreground px-3 py-2 shadow-sm bg-neo-yellow"
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
