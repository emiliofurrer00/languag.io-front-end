'use client';

import * as React from 'react';

type QueryInvalidationContextValue = {
  invalidateQueries: (queryKeys: string[]) => void;
  getVersion: (queryKey: string) => number;
};

const QueryInvalidationContext = React.createContext<QueryInvalidationContextValue | null>(null);

export function QueryInvalidationProvider({ children }: { children: React.ReactNode }) {
  const [versions, setVersions] = React.useState<Record<string, number>>({});

  function invalidateQueries(queryKeys: string[]) {
    setVersions((currentVersions) => {
      const nextVersions = { ...currentVersions };

      for (const queryKey of queryKeys) {
        nextVersions[queryKey] = (nextVersions[queryKey] ?? 0) + 1;
      }

      return nextVersions;
    });
  }

  function getVersion(queryKey: string) {
    return versions[queryKey] ?? 0;
  }

  return (
    <QueryInvalidationContext.Provider value={{ invalidateQueries, getVersion }}>
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
