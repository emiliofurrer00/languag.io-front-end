import Navbar from '@/components/profile/Navbar';

export default function ProfilePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar />
    </div>
  );
}
