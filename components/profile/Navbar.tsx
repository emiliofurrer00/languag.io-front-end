'use client';

import { SocialNavActions } from '@/components/social/SocialNavActions';
import { NeoButton } from '@/components/ui/NeoButton';
import { ArrowLeft, PencilLine } from 'lucide-react';
import Link from 'next/link';

type ProfileNavbarProps = {
  canEdit?: boolean;
  title?: string;
};

export default function Navbar({ canEdit = false, title = 'Profile' }: ProfileNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-3">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 rounded-full bg-primary border-2 border-foreground flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              <Link href="/decks">
                <NeoButton variant="secondary" className="py-2 px-4 text-sm cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </NeoButton>
              </Link>
            </div>
            <span className="font-display font-bold text-xl">{title}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <SocialNavActions />
          {canEdit ? (
            <NeoButton variant="primary" className="cursor-pointer" size="sm">
              <PencilLine className="w-4 h-4" />
              Edit Profile
            </NeoButton>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
