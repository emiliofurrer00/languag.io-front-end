import { Sparkles, ArrowLeft, Save } from 'lucide-react';
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
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Link href="/decks">
            <NeoButton variant="secondary" className="py-2 px-4 text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:block">Back</span>
            </NeoButton>
          </Link>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text:sm md:text-xl">
              {isEditMode ? 'Edit Deck' : 'Create Deck'}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
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
