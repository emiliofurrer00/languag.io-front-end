import Navbar from '@/components/create-form/Navbar';
import DeckDetails from '@/components/create-form/DeckDetails';

export default function CreateDeckPage() {
  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar />
      <section className="pt-28 px-3">
        <DeckDetails />
      </section>
    </div>
  );
}
