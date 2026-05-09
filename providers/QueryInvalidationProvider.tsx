'use client';

import * as React from 'react';

type QueryInvalidationContextValue = {
  invalidateQueries: (queryKeys: string[]) => void;
  getVersion: (queryKey: string) => number;
  getCachedQueryData: <T>(queryKey: string) => T | undefined;
  setCachedQueryData: <T>(queryKey: string, data: T | null | undefined) => void;
};

const QueryInvalidationContext = React.createContext<QueryInvalidationContextValue | null>(null);

export function QueryInvalidationProvider({ children }: { children: React.ReactNode }) {
  const [versions, setVersions] = React.useState<Record<string, number>>({});
  const cacheRef = React.useRef<Record<string, unknown>>({});

  const invalidateQueries = React.useCallback((queryKeys: string[]) => {
    setVersions((currentVersions) => {
      const nextVersions = { ...currentVersions };

      for (const queryKey of queryKeys) {
        nextVersions[queryKey] = (nextVersions[queryKey] ?? 0) + 1;
      }

      return nextVersions;
    });
  }, []);

  const getVersion = React.useCallback((queryKey: string) => {
    return versions[queryKey] ?? 0;
  }, [versions]);

  const getCachedQueryData = React.useCallback(<T,>(queryKey: string) => {
    return cacheRef.current[queryKey] as T | undefined;
  }, []);

  const setCachedQueryData = React.useCallback(
    <T,>(queryKey: string, data: T | null | undefined) => {
      if (data === null || data === undefined) {
        delete cacheRef.current[queryKey];
        return;
      }

      cacheRef.current[queryKey] = data;
    },
    []
  );

  const value = React.useMemo(
    () => ({
      invalidateQueries,
      getVersion,
      getCachedQueryData,
      setCachedQueryData,
    }),
    [getCachedQueryData, getVersion, invalidateQueries, setCachedQueryData]
  );

  return (
    <QueryInvalidationContext.Provider value={value}>
      {children}
    </QueryInvalidationContext.Provider>
  );
}

export function useInvalidateQueries() {
  const context = React.useContext(QueryInvalidationContext);

  if (!context) {
    throw new Error('useInvalidateQueries must be used within QueryInvalidationProvider.');
  }

  return context.invalidateQueries;
}

export function useQueryVersion(queryKey: string) {
  const context = React.useContext(QueryInvalidationContext);

  if (!context) {
    throw new Error('useQueryVersion must be used within QueryInvalidationProvider.');
  }

  return context.getVersion(queryKey);
}

export function useQueryValueCache() {
  const context = React.useContext(QueryInvalidationContext);

  if (!context) {
    throw new Error('useQueryValueCache must be used within QueryInvalidationProvider.');
  }

  return {
    getCachedQueryData: context.getCachedQueryData,
    setCachedQueryData: context.setCachedQueryData,
  };
}
