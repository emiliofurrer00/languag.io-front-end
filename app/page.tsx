import HeroSection from '@/components/landing/HeroSection';
import Navbar from '@/components/landing/Navbar';
import StatsSection from '@/components/landing/StatsSection';

function Star() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="m5.825 22l1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625l7.2.625l-5.45 4.725L18.175 22L12 18.275L5.825 22Z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background  font-sans dark:bg-black w-full">
      <Navbar />
      <main className="flex min-h-screen w-full flex-col items-center  dark:bg-black sm:items-start">
        <HeroSection />
        <StatsSection />
      </main>
    </div>
  );
}
