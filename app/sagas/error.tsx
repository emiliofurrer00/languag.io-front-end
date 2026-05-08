'use client';

import { RouteErrorState } from '@/components/layout/RouteErrorState';

export default function SagasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Sagas could not load"
      error={error}
      reset={reset}
      backHref="/decks"
      backLabel="Browse decks"
    />
  );
}
