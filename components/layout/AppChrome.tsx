'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { DesktopSideNav } from '@/components/layout/DesktopSideNav';

const appShellPathPrefixes = [
  '/decks',
  '/feed',
  '/friends',
  '/notifications',
  '/profile',
  '/sagas',
];

function usesAppShell(pathname: string) {
  return appShellPathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {usesAppShell(pathname) ? <DesktopSideNav /> : null}
      {children}
    </>
  );
}
