import { Lock, LockIcon } from 'lucide-react';

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

export default function DeckDetails() {
  return (
    <div className="border-3 rounded-lg shadow-[5px_5px_0_0_hsl(var(--foreground))] p-5">
      <h2 className="text-lg font-bold mb-5">Deck Details</h2>
      <div className="flex flex-col gap-5">
        <label className="text-sm font-bold">
          Deck Title *
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-2 border-foreground px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="e.g., Spanish Basics"
          />
        </label>
        <label className="text-sm font-bold">
          Description
          <textarea
            type="text"
            className="mt-1 block w-full rounded-md h-24 border-2 border-foreground px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="A brief description of your deck."
          />
        </label>
        <label className="text-sm font-bold">
          Category
          <CategorySelect />
        </label>
        <div>
          <span className="text-sm font-bold mb-4">Deck Color</span>
          <div className="flex gap-3">
            <div className="cursor-pointer w-12 h-12 border-3 bg-neo-teal rounded-xl shadow-[3px_3px_0_0_hsl(var(--foreground))]"></div>
            <div className="cursor-pointer w-12 h-12 border-3 bg-neo-blue rounded-xl shadow-[3px_3px_0_0_hsl(var(--foreground))]"></div>
            <div className="cursor-pointer w-12 h-12 border-3 bg-neo-coral rounded-xl shadow-[3px_3px_0_0_hsl(var(--foreground))]"></div>
            <div className="cursor-pointer w-12 h-12 border-3 bg-neo-magenta rounded-xl shadow-[3px_3px_0_0_hsl(var(--foreground))]"></div>
            <div className="cursor-pointer w-12 h-12 border-3 bg-neo-yellow rounded-xl shadow-[3px_3px_0_0_hsl(var(--foreground))]"></div>
          </div>
        </div>
        <div className="flex items-center bg-neo-black/10 py-5 px-5 border-3 rounded gap-4">
          <div>
            <LockIcon className="text-black/60 w-5 h-5"></LockIcon>
          </div>
          <div>
            <span className="text-md font-bold mb-4">Private Deck</span>
            <p className="text-black/50 text-sm">Only you can see this deck.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySelect() {
  return (
    <select className="font-normal mt-1 block w-fit rounded-md border-2 border-foreground px-3 py-2 shadow-sm bg-neo-yellow">
      {CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
