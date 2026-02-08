'use client';

import Navbar from '@/components/create-form/Navbar';
import DeckDetails from '@/components/create-form/DeckDetails';
import DeckPreview from '@/components/create-form/DeckPreview';
import { useState } from 'react';

export default function CreateDeckPage() {
  const [deckDetails, setDeckDetails] = useState({
    title: '',
    description: '',
    category: '',
    color: 'teal',
    isPrivate: true,
  });

  return (
    <div className="bg-background min-h-screen w-full">
      <Navbar />
      <section className="pt-28 px-3">
        <DeckDetails deckDetails={deckDetails} setDeckDetails={setDeckDetails} />
        <DeckPreview deckDetails={deckDetails} />
      </section>
    </div>
  );
}
