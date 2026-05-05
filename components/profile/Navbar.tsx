'use client';

import AppNavbar from '@/components/layout/AppNavbar';
import { SocialNavActions } from '@/components/social/SocialNavActions';
import { NeoButton } from '@/components/ui/NeoButton';
import { cn } from '@/lib/utils';
import { ArrowLeft, PencilLine } from 'lucide-react';
import Link from 'next/link';

type ProfileNavbarProps = {
  canEdit?: boolean;
  title?: string;
};

const backLinkClassName = cn(
  'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground bg-secondary px-4 py-2 font-display text-sm font-semibold text-secondary-foreground transition-all',
  'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
);

export default function Navbar({ canEdit = false, title = 'Profile' }: ProfileNavbarProps) {
  const renderEditAction = () =>
    canEdit ? (
      <NeoButton variant="primary" className="cursor-pointer" size="sm">
        <PencilLine className="h-4 w-4" />
        <span className="hidden md:inline">Edit Profile</span>
        <span className="md:hidden">Edit</span>
      </NeoButton>
    ) : null;

  const mobileEditAction = canEdit ? (
    <NeoButton variant="primary" className="cursor-pointer" size="sm">
      <PencilLine className="h-4 w-4" />
      Edit
    </NeoButton>
  ) : null;

  return (
    <AppNavbar
      leftContent={
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/decks" className={backLinkClassName}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden md:block">Back</span>
          </Link>
          <span className="truncate font-display text-base font-bold md:text-xl">{title}</span>
        </div>
      }
      actions={
        <>
          <SocialNavActions />
          {renderEditAction()}
        </>
      }
      mobileActions={mobileEditAction}
      showDesktopSideNav
    />
  );
}
