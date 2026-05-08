'use client';

import { RouteErrorState } from '@/components/layout/RouteErrorState';

export default function SocialError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Your social page could not load"
      error={error}
      reset={reset}
      backHref="/decks"
      backLabel="Browse decks"
    />
  );
}
