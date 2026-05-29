'use client';

import { useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import posthog from 'posthog-js';

export function PostHogIdentify() {
  const { isLoading, user } = useKindeBrowserClient();

  useEffect(() => {
    if (isLoading || !user?.id) return;

    posthog.identify(user.id, {
      email: user.email,
      name: [user.given_name, user.family_name].filter(Boolean).join(' '),
    });
  }, [isLoading, user]);

  return null;
}
