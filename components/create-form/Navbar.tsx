'use client';

import AppNavbar from '@/components/layout/AppNavbar';
import { NeoButton } from '@/components/ui/NeoButton';
import { cn } from '@/lib/utils';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function Navbar({
  handleSave,
  isEditMode,
}: {
  handleSave: (submitNewDeck: boolean) => Promise<boolean>;
  isEditMode: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const saveLabel = isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Deck';

  const onSave = () => {
    startTransition(async () => {
      const didSave = await handleSave(!isEditMode);

      if (didSave) {
        router.push('/decks');
      }
    });
  };

  const renderSaveButton = (compact = false) => (
    <NeoButton
      variant="primary"
      size="sm"
      className={cn('cursor-pointer text-sm md:text-base', compact ? 'h-11 w-11 p-0' : null)}
      onClick={onSave}
      disabled={isPending}
      aria-label={saveLabel}
    >
      <Save className="h-4 w-4" />
      {compact ? <span className="sr-only">{saveLabel}</span> : saveLabel}
    </NeoButton>
  );

  return (
    <AppNavbar
      leftContent={
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/decks"
            className="inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-secondary px-4 py-2 font-display text-sm font-semibold text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden md:block">Back</span>
          </Link>
          <span className="truncate font-display text-sm font-bold md:text-xl">
            {isEditMode ? 'Edit Deck' : 'Create Deck'}
          </span>
        </div>
      }
      actions={renderSaveButton()}
      mobileActions={renderSaveButton(true)}
    />
  );
}
