import type { Metadata } from 'next';
import SagaDetailView from '@/components/sagas/SagaDetailView';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSagaDetails } from '@/lib/sagas/server';
import { getSagaLessonCount } from '@/lib/sagas/display';
import { buildAbsoluteUrl, createNoIndexMetadata, createPageMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';

type SagaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: SagaDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const saga = await getSagaDetails(id);
    const lessonCount = getSagaLessonCount(saga);
    const fallbackDescription = `Follow ${lessonCount} ${lessonCount === 1 ? 'deck' : 'decks'} through ${saga.title || 'this guided study saga'} on Languag.io.`;

    return createPageMetadata({
      title: `${saga.title || 'Untitled saga'} study path`,
      description: saga.description || fallbackDescription,
      path: `/sagas/${encodeURIComponent(saga.id ?? id)}`,
      type: 'article',
    });
  } catch {
    return createNoIndexMetadata('Saga not found');
  }
}

export default async function SagaDetailPage({ params }: SagaDetailPageProps) {
  const { id } = await params;
  let saga;

  try {
    saga = await getSagaDetails(id);
  } catch {
    notFound();
  }

  const lessonCount = getSagaLessonCount(saga);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: saga.title || 'Untitled saga',
          description:
            saga.description ||
            `Follow ${lessonCount} ${lessonCount === 1 ? 'deck' : 'decks'} in this guided study saga.`,
          url: buildAbsoluteUrl(`/sagas/${encodeURIComponent(saga.id)}`),
          learningResourceType: 'Guided study path',
          educationalUse: 'Practice',
          numberOfItems: lessonCount,
          about: saga.category || undefined,
          creator: saga.ownerName
            ? {
                '@type': 'Person',
                name: saga.ownerName,
              }
            : undefined,
        }}
      />
      <SagaDetailView saga={saga} />
    </>
  );
}
