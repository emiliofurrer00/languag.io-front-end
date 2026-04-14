import Navbar from '@/components/profile/Navbar';
import ProfilePageContainer from '@/components/profile/ProfilePageContainer';

export default function ProfilePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar />
      <ProfilePageContainer />
    </div>
  );
}
