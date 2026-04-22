'use client';

import * as React from 'react';

import { ApiError } from '@/lib/api';
import type { CursorPage } from '@/lib/social/types';
import { useQueryVersion } from '@/providers/QueryInvalidationProvider';

type ValueQueryOptions<T> = {
  enabled?: boolean;
  initialData?: T;
  pollMs?: number;
};

type CursorQueryOptions = {
  enabled?: boolean;
  pageSize?: number;
};

function isNil<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return error.message.replace(/^API request failed for [^:]+:\s*/, '') || fallbackMessage;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export function useInvalidatedValueQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options?: ValueQueryOptions<T>
) {
  const { enabled = true, initialData, pollMs } = options ?? {};
  const queryVersion = useQueryVersion(queryKey);
  const [data, setData] = React.useState<T | null>(initialData ?? null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(enabled && isNil(initialData));
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [reloadToken, setReloadToken] = React.useState(0);
  const hasLoadedRef = React.useRef(!isNil(initialData));
  const requestIdRef = React.useRef(0);

  React.useEffect(() => {
    setData(initialData ?? null);
    setErrorMessage(null);
    setIsLoading(enabled && isNil(initialData));
    setIsRefreshing(false);
    hasLoadedRef.current = !isNil(initialData);
    requestIdRef.current += 1;
  }, [enabled, initialData, queryKey]);

  const loadQuery = React.useEffectEvent(async () => {
    const requestId = ++requestIdRef.current;
    const shouldRefreshInPlace = hasLoadedRef.current && !isNil(data);

    setErrorMessage(null);
    if (shouldRefreshInPlace) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const nextData = await queryFn();
      if (requestId !== requestIdRef.current) {
        return;
      }

      hasLoadedRef.current = true;
      setData(nextData);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setErrorMessage(getApiErrorMessage(error, 'We could not load this data.'));
    } finally {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setIsLoading(false);
      setIsRefreshing(false);
    }
  });

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadQuery();
  }, [enabled, queryVersion, reloadToken]);

  React.useEffect(() => {
    if (!enabled || !pollMs) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setReloadToken((current) => current + 1);
    }, pollMs);

    return () => window.clearInterval(intervalId);
  }, [enabled, pollMs]);

  const refetch = React.useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  return {
    data,
    errorMessage,
    isLoading,
    isRefreshing,
    refetch,
  };
}

export function useInvalidatedCursorQuery<T>(
  queryKey: string,
  queryPage: (options: { cursor?: string | null; pageSize: number }) => Promise<CursorPage<T>>,
  options?: CursorQueryOptions
) {
  const { enabled = true, pageSize = 20 } = options ?? {};
  const queryVersion = useQueryVersion(queryKey);
  const [items, setItems] = React.useState<T[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(enabled);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [reloadToken, setReloadToken] = React.useState(0);
  const hasLoadedRef = React.useRef(false);
  const requestIdRef = React.useRef(0);

  React.useEffect(() => {
    setItems([]);
    setNextCursor(null);
    setErrorMessage(null);
    setIsLoading(enabled);
    setIsRefreshing(false);
    setIsLoadingMore(false);
    hasLoadedRef.current = false;
    requestIdRef.current += 1;
  }, [enabled, queryKey]);

  const loadFirstPage = React.useEffectEvent(async () => {
    const requestId = ++requestIdRef.current;

    setErrorMessage(null);
    if (hasLoadedRef.current) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const page = await queryPage({ pageSize });
      if (requestId !== requestIdRef.current) {
        return;
      }

      hasLoadedRef.current = true;
      setItems(page.items);
      setNextCursor(page.nextCursor ?? null);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setErrorMessage(getApiErrorMessage(error, 'We could not load this list.'));
    } finally {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  });

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadFirstPage();
  }, [enabled, pageSize, queryVersion, reloadToken]);

  const loadMore = React.useCallback(async () => {
    if (!enabled || !nextCursor || isLoadingMore) {
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoadingMore(true);
    setErrorMessage(null);

    try {
      const page = await queryPage({ cursor: nextCursor, pageSize });
      if (requestId !== requestIdRef.current) {
        return;
      }

      hasLoadedRef.current = true;
      setItems((currentItems) => [...currentItems, ...page.items]);
      setNextCursor(page.nextCursor ?? null);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setErrorMessage(getApiErrorMessage(error, 'We could not load more items.'));
    } finally {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setIsLoadingMore(false);
    }
  }, [enabled, isLoadingMore, nextCursor, pageSize, queryPage]);

  const refetch = React.useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  return {
    items,
    nextCursor,
    errorMessage,
    isLoading,
    isRefreshing,
    isLoadingMore,
    loadMore,
    refetch,
  };
}
