import HeroSection from '@/components/landing/HeroSection';
import Navbar from '@/components/landing/Navbar';
import CardShowcaseSection from '@/components/landing/CardShowcase';
import DeckShowcaseSection from '@/components/landing/DeckShowcase';
import StudyFlowSection from '@/components/landing/StudyFlow';
import AIAssistSection from '@/components/landing/AIAssist';
import SagasSection from '@/components/landing/Sagas';
import QuietCTASection from '@/components/landing/QuietCTA';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Flashcards and guided study paths',
  description:
    'Build flashcards, browse public decks, and follow guided sagas that make language learning and memorization easier to keep up with.',
});

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    redirect('/feed');
  }

  return (
    <div className="flex flex-col items-center justify-center bg-background font-sans dark:bg-black">
      <Navbar isLandingPage={true} />
      <main className="flex w-full flex-col items-center dark:bg-black sm:items-start">
        <HeroSection />
        <CardShowcaseSection />
        <DeckShowcaseSection />
        <StudyFlowSection />
        <AIAssistSection />
        <SagasSection />
        <QuietCTASection />
      </main>
    </div>
  );
}
