'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Layers } from 'lucide-react';
import { revealViewport } from './motionViewport';

const decks = [
  { title: 'Spanish - A1 vocab', count: 84, color: 'bg-neo-magenta', tag: 'Languages' },
  { title: 'React Hooks', count: 32, color: 'bg-neo-teal', tag: 'Code' },
  { title: 'World Capitals', count: 196, color: 'bg-neo-yellow', tag: 'Geography' },
  { title: 'Bones of the body', count: 48, color: 'bg-neo-coral', tag: 'Anatomy' },
  { title: 'Latin roots', count: 120, color: 'bg-neo-blue', tag: 'Languages' },
];

const DeckShowcaseSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-40%']);

  return (
    <section ref={ref} className="py-32 relative overflow-hidden w-full">
      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: 0.6 }}
          className="max-w-2xl ml-auto text-right"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            02 - The deck
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            Group cards
            <br />
            <span className="text-muted-foreground">by anything.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A subject, a chapter, a trip, a shower thought. Decks are just folders you actually want
            to open.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <motion.div style={{ x }} className="flex gap-6 px-4 will-change-transform">
          {decks.map((deck, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-72 h-44 rounded-2xl border-[3px] border-foreground p-6 shadow-[6px_6px_0_0_hsl(var(--foreground))] ${deck.color} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-card border-2 border-foreground rounded-full">
                  {deck.tag}
                </span>
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl leading-tight mb-1">{deck.title}</h3>
                <p className="text-sm opacity-70">{deck.count} cards</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DeckShowcaseSection;
