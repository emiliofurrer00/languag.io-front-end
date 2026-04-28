'use client';

import { FormEvent, useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

type DeckFiltersProps = {
  searchQuery?: string;
  ownerUsername?: string;
};

const filterActionClassName =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-primary px-4 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const secondaryActionClassName =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-secondary px-4 font-display text-sm font-semibold text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function removeDeckSearchAliases(params: URLSearchParams) {
  params.delete('searchQuery');
  params.delete('search');
  params.delete('q');
}

function normalizeDeckOwnerParam(params: URLSearchParams, ownerUsername?: string) {
  params.delete('owner');

  if (ownerUsername) {
    params.set('username', ownerUsername);
  } else {
    params.delete('username');
  }
}

export default function DeckFilters({ searchQuery = '', ownerUsername }: DeckFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchQuery);
  const [isPending, startTransition] = useTransition();
  const hasSearchQuery = Boolean(searchQuery.trim());

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  function buildHref(nextSearchQuery?: string) {
    const params = new URLSearchParams(searchParams.toString());
    removeDeckSearchAliases(params);
    normalizeDeckOwnerParam(params, ownerUsername);

    const normalizedSearchQuery = nextSearchQuery?.trim();
    if (normalizedSearchQuery) {
      params.set('searchQuery', normalizedSearchQuery);
    }

    const queryString = params.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      router.replace(buildHref(value), { scroll: false });
    });
  }

  function handleClear() {
    setValue('');

    startTransition(() => {
      router.replace(buildHref(), { scroll: false });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search decks..."
          aria-label="Search decks"
          className="h-12 w-full rounded-xl border-[2px] border-foreground bg-background pl-12 pr-4 text-sm font-medium shadow-[4px_4px_0_0_hsl(var(--foreground))] outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <button type="submit" className={filterActionClassName} disabled={isPending}>
        <Search className="h-4 w-4" />
        Search
      </button>
      {hasSearchQuery ? (
        <button
          type="button"
          onClick={handleClear}
          className={secondaryActionClassName}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      ) : null}
    </form>
  );
}
