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
  const isPublic = Boolean(visibility);

  return (
    <div className="rounded-lg border-[3px] border-foreground p-5 shadow-[5px_5px_0_0_hsl(var(--foreground))]">
      <h2 className="mb-5 text-lg font-bold">Deck Details</h2>
      <div className="flex flex-col gap-5">
        <label className="text-sm font-bold" htmlFor="deck-title">
          Deck Title *
          <input
            id="deck-title"
            type="text"
            className="mt-1 block w-full rounded-md border-2 border-foreground bg-background px-3 py-2 font-normal shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., Spanish Basics"
            onChange={(event) => setDeckDetails({ ...deckDetails, title: event.target.value })}
            value={title ?? ''}
            maxLength={80}
            required
          />
        </label>

        <label className="text-sm font-bold" htmlFor="deck-description">
          Description
          <textarea
            id="deck-description"
            className="mt-1 block h-24 w-full resize-y rounded-md border-2 border-foreground bg-background px-3 py-2 font-normal shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="A brief description of your deck."
            onChange={(event) =>
              setDeckDetails({ ...deckDetails, description: event.target.value })
            }
            value={description ?? ''}
            maxLength={280}
          />
        </label>

        <label className="text-sm font-bold" htmlFor="deck-category">
          Category
          <CategorySelect
            id="deck-category"
            value={category || 'Language'}
            onChange={(event) => setDeckDetails({ ...deckDetails, category: event.target.value })}
          />
        </label>

        <div>
          <DeckColors
            selectedColor={color ?? 'teal'}
            onColorSelect={(nextColor) => setDeckDetails({ ...deckDetails, color: nextColor })}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded border-[3px] border-foreground bg-neo-black/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div>
              {isPublic ? (
                <Globe className="h-5 w-5 text-neo-teal" />
              ) : (
                <LockIcon className="h-5 w-5 text-black/60" />
              )}
            </div>
            <div>
              <span className="mb-4 text-base font-bold">
                {isPublic ? 'Public Deck' : 'Private Deck'}
              </span>
              <p className="text-sm text-black/50">
                {isPublic ? 'Everyone can see this deck.' : 'Only you can see this deck.'}
              </p>
            </div>
          </div>
          <Switch
            checked={isPublic}
            aria-label="Toggle public deck visibility"
            onCheckedChange={(nextVisibility) =>
              setDeckDetails({ ...deckDetails, visibility: nextVisibility ? 1 : 0 })
            }
          />
        </div>
      </div>
    </div>
  );
}

function CategorySelect({ id, value, onChange }) {
  return (
    <select
      id={id}
      className="mt-1 block w-full rounded-md border-2 border-foreground bg-neo-yellow px-3 py-2 font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-ring sm:w-fit"
      value={value}
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
