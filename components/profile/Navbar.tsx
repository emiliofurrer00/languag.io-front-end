'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { cn } from '@/lib/utils';
import { NeoButton } from '@/components/ui/NeoButton';
import { ArrowLeft, Pencil, PencilLine, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const displayName = user?.given_name || user?.family_name || user?.email || 'User';
  const authButtonClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground font-semibold transition-all font-display',
    'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
    'px-4 py-2 text-sm'
  );

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
            <span className="font-display font-bold text-xl">Profile</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <NeoButton variant="primary" className="cursor-pointer" size="sm">
            <PencilLine className="w-4 h-4" />
            Edit Profile
          </NeoButton>
        </div>
      </div>
    </nav>
  );
}
