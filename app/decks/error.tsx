'use client';

import { RouteErrorState } from '@/components/layout/RouteErrorState';

export default function DecksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorState title="Decks could not load" error={error} reset={reset} />;
}
