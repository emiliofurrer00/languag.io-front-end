import DeckCard from './DeckCard';
import Navbar from './Navbar';
import { DeckSummary } from '@/lib/decks/types';

export default function DeskListContainer({
  decks,
}: {
  decks: DeckSummary[];
}) {
  return (
    <>
      <Navbar />
      <section>
        <div className="px-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deckData={deck} />
          ))}
        </div>
      </section>
    </>
  );
}
