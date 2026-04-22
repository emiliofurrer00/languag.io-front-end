"use client";

import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs';
import { Toaster } from '@/components/ui/Toaster';
import { QueryInvalidationProvider } from '@/providers/QueryInvalidationProvider';

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <KindeProvider>
      <QueryInvalidationProvider>
        {children}
        <Toaster />
      </QueryInvalidationProvider>
    </KindeProvider>
  );
}
