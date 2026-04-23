import { ArrowLeft, Save } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar({
  handleSave,
  isEditMode,
}: {
  handleSave: (submitNewDeck: boolean) => Promise<boolean>;
  isEditMode: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex gap-4 items-center">
          <Link
            href="/decks"
            className="inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-secondary px-4 py-2 font-display text-sm font-semibold text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden md:block">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold md:text-xl">
              {isEditMode ? 'Edit Deck' : 'Create Deck'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NeoButton
            variant="primary"
            className="cursor-pointer text-sm md:text-base"
            onClick={() => {
              startTransition(async () => {
                const didSave = await handleSave(!isEditMode);

                if (didSave) {
                  router.push('/decks');
                }
              });
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
