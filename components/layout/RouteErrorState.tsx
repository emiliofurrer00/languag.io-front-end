'use client';

import Link from 'next/link';
import { Home, RefreshCcw, WifiOff } from 'lucide-react';

import { AppStatePanel, stateActionClassName } from '@/components/ui/AppStatePanel';
import { getApiErrorDisplayMessage } from '@/lib/api';

type RouteErrorStateProps = {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
  backHref?: string;
  backLabel?: string;
};

export function RouteErrorState({
  title,
  error,
  reset,
  backHref = '/',
  backLabel = 'Back home',
}: RouteErrorStateProps) {
  const message = getApiErrorDisplayMessage(
    error,
    'We could not load this page. Try again in a moment.'
  );

  return (
    <main className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-3xl items-center px-4 py-10">
      <AppStatePanel
        icon={WifiOff}
        tone="error"
        kicker="Something did not load"
        title={title}
        description={message}
        className="w-full"
      >
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className={stateActionClassName}>
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
          <Link href={backHref} className={stateActionClassName}>
            <Home className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>
      </AppStatePanel>
    </main>
  );
}
