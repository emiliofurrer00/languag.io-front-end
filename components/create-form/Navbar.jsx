import { Sparkles, ArrowLeft, Save } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import Link from 'next/link';
import { useTransition } from 'react';
import { redirect } from 'next/navigation';

export default function Navbar({ handleSave, isEditMode }) {
  const [isPending, startTransition] = useTransition();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-3">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-6">
          <Link href="/decks">
            <NeoButton variant="ghost" className="py-2 px-4 text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Back
            </NeoButton>
          </Link>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary border-[2px] border-foreground flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl">
              {isEditMode ? 'Edit Deck' : 'Create Deck'}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <NeoButton
            variant="primary"
            className="cursor-pointer"
            onClick={() => {
              startTransition(async () => {
                (await isEditMode) ? handleSave(false) : handleSave(true);
              });
              // TODO: Handle it gracefully after a successful save (e.g., show a toast notification) instead of an immediate redirect
              redirect('/decks');
            }}
            disabled={isPending}
          >
            <Save className="w-4 h-4" />
            {isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Deck'}
          </NeoButton>
        </div>
      </div>
    </nav>
  );
}
