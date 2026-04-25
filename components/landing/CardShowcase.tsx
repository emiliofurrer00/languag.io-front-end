'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';

const sampleCards = [
  {
    front: 'What does HTML stand for?',
    back: 'HyperText Markup Language',
    color: 'bg-neo-magenta',
  },
  { front: 'Capital of Japan?', back: 'Tokyo', color: 'bg-neo-teal' },
  {
    front: 'useEffect runs after...',
    back: '...the render is committed to the screen',
    color: 'bg-neo-yellow',
  },
  { front: 'Mitochondria are the...', back: '...powerhouse of the cell', color: 'bg-neo-coral' },
];

interface CardItemProps {
  card: (typeof sampleCards)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
  isFlipped: boolean;
  onFlip: () => void;
}

const CardItem = ({ card, index, scrollYProgress, isFlipped, onFlip }: CardItemProps) => {
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -3 : 3, index % 2 === 0 ? 3 : -3]
  );

  return (
    <motion.div
      style={{ y, rotate }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped ? `Show front of sample card ${index + 1}` : `Flip sample card ${index + 1}`
      }
      onClick={onFlip}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onFlip();
        }
      }}
    >
      <motion.div
        className="relative w-full aspect-[3/4] transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl border-[3px] border-foreground p-6 flex flex-col justify-between shadow-[6px_6px_0_0_hsl(var(--foreground))] ${card.color}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">Front</span>
          <p className="font-display font-bold text-xl md:text-2xl leading-tight">{card.front}</p>
          <div className="flex items-center gap-1 text-xs opacity-60">
            <RotateCw className="w-3 h-3" />
            <span>tap</span>
          </div>
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-[3px] border-foreground p-6 flex flex-col justify-between shadow-[6px_6px_0_0_hsl(var(--foreground))] bg-card">
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">Answer</span>
          <p className="font-display font-bold text-xl md:text-2xl leading-tight">{card.back}</p>
          <div className="flex items-center gap-1 text-xs opacity-60">
            <RotateCw className="w-3 h-3" />
            <span>tap back</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CardShowcaseSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-32 relative overflow-hidden w-full">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            01 - The card
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            One question.
            <br />
            <span className="text-muted-foreground">One answer.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tap any card to flip it. That&apos;s the whole interaction - simple enough that it gets
            out of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto perspective-1000">
          {sampleCards.map((card, i) => (
            <CardItem
              key={i}
              card={card}
              index={i}
              scrollYProgress={scrollYProgress}
              isFlipped={flipped === i}
              onFlip={() => setFlipped(flipped === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardShowcaseSection;
