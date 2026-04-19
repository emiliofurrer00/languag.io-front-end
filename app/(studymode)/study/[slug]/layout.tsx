import Navbar from '@/components/landing/Navbar';

export default function StudyModeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen w-full pt-14">
      <Navbar /> {children}
    </div>
  );
}
