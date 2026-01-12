'use client';

import { useUser, SignInButton } from '@clerk/nextjs';

export default function MagicButton() {
  const { user, isSignedIn } = useUser();

  return (
    <SignInButton mode="modal">
      <button
        className={`text-lg font-mono font-semibold ${isSignedIn ? 'text-black bg-white border-4 border-black' : 'text-white bg-black'} px-5 py-3 w-full rounded-sm`}
        disabled={isSignedIn}
      >
        {isSignedIn
          ? `🐦 Welcome ${user?.firstName || user?.fullName || 'User'} 💩`
          : 'I wanna be like them'}
      </button>
    </SignInButton>
  );
}
