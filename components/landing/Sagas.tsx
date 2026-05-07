'use client';

import { motion } from 'framer-motion';
import { BookOpen, Flag, Map, Swords } from 'lucide-react';
import Link from 'next/link';
import { NeoButton } from '@/components/ui/NeoButton';

const path = [
  { icon: BookOpen, label: 'Greetings', color: 'bg-neo-teal' },
  { icon: BookOpen, label: 'Numbers', color: 'bg-neo-yellow' },
  { icon: Flag, label: 'Checkpoint', color: 'bg-neo-blue' },
  { icon: BookOpen, label: 'Food', color: 'bg-neo-coral' },
  { icon: Swords, label: 'Boss', color: 'bg-neo-magenta' },
];

const SagasSection = () => {
  return (
    <section className="py-24 relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 rounded-2xl border-[3px] border-foreground bg-card p-6 shadow-[6px_6px_0_0_hsl(var(--foreground))]"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
              <Map className="w-4 h-4" />
              Italian, from scratch
            </div>
            <div className="relative pl-6">
              <motion.div
                aria-hidden
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-foreground/30 origin-top"
              />
              <ul className="space-y-3">
                {path.map((p, i) => (
                  <motion.li
                    key={p.label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{
                        duration: 0.4,
                        delay: 0.25 + i * 0.12,
                        type: 'spring',
                        stiffness: 260,
                      }}
                      className={`relative z-10 w-9 h-9 rounded-full border-2 border-foreground flex items-center justify-center ${p.color}`}
                    >
                      <p.icon className="w-4 h-4" />
                    </motion.div>
                    <span className="font-medium">{p.label}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              05 &mdash; Sagas
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
              String decks into
              <br />
              <span className="text-muted-foreground">a path.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              A saga is a small course you build from your own decks - with checkpoints and the
              occasional boss. Useful for learning a language or following a syllabus without losing
              the plot.
            </p>
            <Link href="/sagas">
              <NeoButton variant="secondary" size="md">
                See how sagas work
              </NeoButton>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SagasSection;
