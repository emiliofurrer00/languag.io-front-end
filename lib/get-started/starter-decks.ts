import type { NeoColor } from '@/lib/theme/neo-colors';

export type StarterDeckCard = {
  front: string;
  back: string;
};

export type StarterDeckIcon = 'language' | 'world' | 'brain';

export type StarterDeck = {
  id: string;
  title: string;
  topic: string;
  description: string;
  icon: StarterDeckIcon;
  color: NeoColor;
  cards: StarterDeckCard[];
};

export const STARTER_DECKS: StarterDeck[] = [
  {
    id: 'spanish-essentials',
    title: 'Spanish Essentials',
    topic: 'Languages',
    description: 'A pocket-sized set for greetings and polite basics.',
    icon: 'language',
    color: 'coral',
    cards: [
      { front: 'Hello', back: 'Hola' },
      { front: 'Thank you', back: 'Gracias' },
      { front: 'Goodbye', back: 'Adios' },
      { front: 'Please', back: 'Por favor' },
      { front: 'Friend', back: 'Amigo / Amiga' },
    ],
  },
  {
    id: 'world-capitals',
    title: 'World Capitals',
    topic: 'Geography',
    description: 'Five classic capitals for a quick geography win.',
    icon: 'world',
    color: 'teal',
    cards: [
      { front: 'Capital of Japan', back: 'Tokyo' },
      { front: 'Capital of France', back: 'Paris' },
      { front: 'Capital of Brazil', back: 'Brasilia' },
      { front: 'Capital of Egypt', back: 'Cairo' },
      { front: 'Capital of Australia', back: 'Canberra' },
    ],
  },
  {
    id: 'brain-snacks',
    title: 'Brain Snacks',
    topic: 'Trivia',
    description: 'Small facts that are easy to start and fun to revisit.',
    icon: 'brain',
    color: 'yellow',
    cards: [
      { front: 'Largest planet?', back: 'Jupiter' },
      { front: 'Speed of light in km/s?', back: 'About 299,792' },
      { front: 'Smallest prime number?', back: '2' },
      { front: 'Currency of Sweden?', back: 'Swedish krona' },
      { front: 'Painted the Mona Lisa?', back: 'Leonardo da Vinci' },
    ],
  },
];
