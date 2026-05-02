import StudyModeContainer from '@/components/study-mode/StudyModeContainer';
import { getDeckDetails, getDeckStudyPlan } from '@/lib/decks/server';

type StudyModePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StudyMode({ params }: StudyModePageProps) {
  const { slug } = await params;
  const defaultData = await getDeckDetails(slug);
  const studyPlan = await getDeckStudyPlan(slug);
  const studyDeck = studyPlan
    ? {
        ...defaultData,
        cards: studyPlan.map((card) => ({
          id: card.cardId,
          type: card.type ?? 'flashcard',
          frontText: card.frontText,
          backText: card.backText,
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

  return <StudyModeContainer mockDeck={studyDeck} />;
}
