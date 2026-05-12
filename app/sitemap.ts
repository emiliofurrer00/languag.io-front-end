import type { MetadataRoute } from 'next';
import { getAllDecks } from '@/lib/decks/server';
import { getSagas } from '@/lib/sagas/server';
import { buildAbsoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

function staticEntry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  return {
    url: buildAbsoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    staticEntry('/', 1),
    staticEntry('/decks', 0.9),
    staticEntry('/sagas', 0.8),
  ];

  try {
    const decks = await getAllDecks({ pageSize: 100 }, 10);

    entries.push(
      ...decks
        .filter((deck) => deck.id)
        .map((deck) => ({
          url: buildAbsoluteUrl(`/decks/${encodeURIComponent(deck.id)}`),
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
    );
  } catch (error) {
    console.warn('Unable to include public decks in sitemap.', error);
  }

  try {
    const sagas = await getSagas();

    entries.push(
      ...sagas
        .filter((saga) => saga.id)
        .map((saga) => ({
          url: buildAbsoluteUrl(`/sagas/${encodeURIComponent(saga.id)}`),
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.65,
        }))
    );
  } catch (error) {
    console.warn('Unable to include public sagas in sitemap.', error);
  }

  return entries;
}
