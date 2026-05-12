import type { MetadataRoute } from 'next';
import { buildAbsoluteUrl, getSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/feed',
        '/friends',
        '/notifications',
        '/onboarding',
        '/profile/me',
        '/decks/editor/',
        '/sagas/create',
        '/create-saga',
      ],
    },
    sitemap: buildAbsoluteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  };
}
