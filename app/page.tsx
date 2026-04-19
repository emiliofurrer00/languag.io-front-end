import HeroSection from '@/components/landing/HeroSection';
import Navbar from '@/components/landing/Navbar';
import StatsSection from '@/components/landing/StatsSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background  font-sans dark:bg-black w-full">
      <Navbar isLandingPage={true} />
      <main className="flex min-h-screen w-full flex-col items-center  dark:bg-black sm:items-start">
        <HeroSection />
        <StatsSection />
      </main>
    </div>
  );
}
