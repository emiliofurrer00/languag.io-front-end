import StudyModeContainer from '@/components/study-mode/StudyModeContainer';
import { getDeckDetails, getDeckStudyPlan } from '@/lib/decks/server';

type StudyModePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    sagaId?: string;
    lessonId?: string;
  }>;
};

export default async function StudyMode({ params, searchParams }: StudyModePageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : undefined;
  const defaultData = await getDeckDetails(slug);
  const studyPlan = await getDeckStudyPlan(slug);
  const studyDeck = studyPlan
    ? {
        ...defaultData,
        deckVersionId: studyPlan[0]?.deckVersionId,
        deckVersionNumber: studyPlan[0]?.deckVersionNumber,
        cards: studyPlan.map((card) => ({
          id: card.cardId,
          deckVersionId: card.deckVersionId,
          deckVersionNumber: card.deckVersionNumber,
          type: card.type ?? 'flashcard',
          frontText: card.frontText,
          backText: card.backText,
          frontAudioAssetId: card.frontAudioAssetId,
          frontAudioUrl: card.frontAudioUrl,
          frontAudioStatus: card.frontAudioStatus,
          exampleSentence: card.exampleSentence,
          choices: card.choices ?? [],
          order: card.order,
          isNew: card.isNew,
          isDue: card.isDue,
          dueAtUtc: card.dueAtUtc,
          intervalDays: card.intervalDays,
          accuracy: card.accuracy,
          totalReviews: card.totalReviews,
          reason: card.reason,
        })),
      }
    : defaultData;

  return (
    <StudyModeContainer
      mockDeck={studyDeck}
      sagaContext={
        query?.sagaId && query?.lessonId
          ? {
              sagaId: query.sagaId,
              lessonId: query.lessonId,
            }
          : undefined
      }
    />
  );
}
