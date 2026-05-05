"use client";

import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs';
import { MotionConfig } from 'framer-motion';
import { Toaster } from '@/components/ui/Toaster';
import { QueryInvalidationProvider } from '@/providers/QueryInvalidationProvider';

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <KindeProvider>
      <MotionConfig reducedMotion="user">
        <QueryInvalidationProvider>
          {children}
          <Toaster />
        </QueryInvalidationProvider>
      </MotionConfig>
    </KindeProvider>
  );
}
