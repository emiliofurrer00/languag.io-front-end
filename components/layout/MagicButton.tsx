'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { cn } from '@/lib/utils';

export default function MagicButton() {
  const { user, isAuthenticated } = useKindeBrowserClient();
  const label = isAuthenticated
    ? `Welcome ${user?.given_name || user?.email || 'User'}`
    : 'I wanna be like them';
  const className = cn(
    'text-lg font-mono font-semibold px-5 py-3 w-full rounded-sm inline-flex items-center justify-center',
    isAuthenticated ? 'text-black bg-white border-4 border-black' : 'text-white bg-black'
  );

  if (isAuthenticated) {
    return (
      <button className={className} disabled type="button">
        {label}
      </button>
    );
  }

  return (
    <RegisterLink className={className} postLoginRedirectURL="/decks">
      {label}
    </RegisterLink>
  );
}
