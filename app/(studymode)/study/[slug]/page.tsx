import StudyModeContainer from '@/components/study-mode/StudyModeContainer';
import { getDeckDetails } from '@/lib/decks/server';

type StudyModePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StudyMode({ params }: StudyModePageProps) {
  const { slug } = await params;
  const defaultData = await getDeckDetails(slug);

  return <StudyModeContainer mockDeck={defaultData} />;
}
