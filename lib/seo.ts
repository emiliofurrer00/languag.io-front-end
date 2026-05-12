import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Languag.io',
  title: 'Languag.io - Flashcards and guided study paths',
  description:
    'Create flashcards, browse public decks, and follow guided study paths designed to help new knowledge stick.',
};

function normalizeSiteUrl(value?: string | null) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(withProtocol);
    url.pathname = '';
    url.search = '';
    url.hash = '';

    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteUrl(process.env.SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL) ??
    'https://languag.io'
  );
}

export function buildAbsoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return new URL(normalizedPath, getSiteUrl()).toString();
}

export function cleanMetaDescription(value?: string | null, fallback = siteConfig.description) {
  const normalizedValue = value?.replace(/\s+/g, ' ').trim();

  if (!normalizedValue) {
    return fallback;
  }

  return normalizedValue.length > 155 ? `${normalizedValue.slice(0, 152).trimEnd()}...` : normalizedValue;
}

type PageMetadataInput = {
  title: string;
  description?: string | null;
  path?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path = '/',
  type = 'website',
  noIndex = false,
}: PageMetadataInput): Metadata {
  const metaDescription = cleanMetaDescription(description);
  const url = buildAbsoluteUrl(path);

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: metaDescription,
      url,
      siteName: siteConfig.name,
      type,
    },
    twitter: {
      card: 'summary',
      title,
      description: metaDescription,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
          },
        },
  };
}

export function createNoIndexMetadata(title: string): Metadata {
  return createPageMetadata({
    title,
    description: siteConfig.description,
    noIndex: true,
  });
}
