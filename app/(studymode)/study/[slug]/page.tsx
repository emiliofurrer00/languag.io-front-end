import { getDefaultDeckDetails } from '@/app/decks/editor/[slug]/page';
import Navbar from '@/components/study-mode/Navbar';
import StudyModeContainer from '@/components/study-mode/StudyModeContainer';

export default async function StudyMode({ params }: any) {
  const { slug } = await params;
  const defaultData = await getDefaultDeckDetails(slug);

  return (
    <>
      <Navbar deckName={defaultData.title} deckColor={defaultData.color} />
      <StudyModeContainer deck={defaultData} />
    </>
  );
}
