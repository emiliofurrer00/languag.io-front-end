'use client';

import AppNavbar from '@/components/layout/AppNavbar';
import { SocialNavActions } from '@/components/social/SocialNavActions';
import { Compass, Plus } from 'lucide-react';
import Link from 'next/link';

const createSagaLinkClassName =
  'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-primary px-3 py-2 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4';

function CreateSagaLink({ compact = false }) {
  return (
    <Link
      href="/sagas/create"
      className={compact ? `${createSagaLinkClassName} h-11 w-11 p-0` : createSagaLinkClassName}
      aria-label={compact ? 'Create saga' : undefined}
    >
      {compact ? <Plus className="h-4 w-4" /> : <Compass className="h-4 w-4" />}
      {compact ? (
        <span className="sr-only">Create saga</span>
      ) : (
        <>
          <span className="hidden sm:inline">Create Saga</span>
          <span className="sm:hidden">New</span>
        </>
      )}
    </Link>
  );
}

export default function SagasNavbar() {
  return (
    <AppNavbar
      title="Sagas"
      actions={
        <>
          <SocialNavActions />
          <CreateSagaLink />
        </>
      }
      mobileActions={<CreateSagaLink compact />}
    />
  );
}

