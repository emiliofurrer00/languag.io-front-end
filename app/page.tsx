import HeroSection from '@/components/landing/HeroSection';
import Navbar from '@/components/landing/Navbar';
import CardShowcaseSection from '@/components/landing/CardShowcase';
import DeckShowcaseSection from '@/components/landing/DeckShowcase';
import StudyFlowSection from '@/components/landing/StudyFlow';
import QuietCTASection from '@/components/landing/QuietCTA';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-background font-sans dark:bg-black">
      <Navbar isLandingPage={true} />
      <main className="flex w-full flex-col items-center dark:bg-black sm:items-start">
        <HeroSection />
        <CardShowcaseSection />
        <DeckShowcaseSection />
        <StudyFlowSection />
        <QuietCTASection />
      </main>
    </div>
  );
}
