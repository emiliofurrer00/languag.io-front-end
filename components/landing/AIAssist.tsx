'use client';

import { motion, useInView } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { NeoButton } from '@/components/ui/NeoButton';

const PROMPT = 'Italian kitchen vocabulary, around 20 cards, beginner.';

const ROWS: [string, string][] = [
  ['forchetta', 'fork'],
  ['coltello', 'knife'],
  ['pentola', 'pot'],
];

const AIAssistSection = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: '-100px' });
  const [typed, setTyped] = useState('');
  const [showRows, setShowRows] = useState(false);

  useEffect(() => {
    if (!inView) return;

    let i = 0;
    let revealId: ReturnType<typeof setTimeout> | undefined;
    const typingId = setInterval(() => {
      i += 1;
      setTyped(PROMPT.slice(0, i));

      if (i >= PROMPT.length) {
        clearInterval(typingId);
        revealId = setTimeout(() => setShowRows(true), 250);
      }
    }, 28);

    return () => {
      clearInterval(typingId);
      if (revealId) clearTimeout(revealId);
    };
  }, [inView]);

  return (
    <section className="py-24 relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              04 &mdash; A small assist
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
              Start with a prompt,
              <br />
              <span className="text-muted-foreground">edit from there.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Describe what you want to learn - a topic, a chapter, a target language - and get a
              draft deck you can trim, rewrite, or throw away. The cards are still yours; the blank
              page just gets shorter.
            </p>
            <Link href="/decks/editor/new">
              <NeoButton variant="secondary" size="md">
                Try it on a deck
              </NeoButton>
            </Link>
          </motion.div>

          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border-[3px] border-foreground bg-card p-6 shadow-[6px_6px_0_0_hsl(var(--foreground))]"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
              <Wand2 className="w-4 h-4" />
              Generate deck
            </div>
            <div className="rounded-xl border-2 border-foreground bg-background p-4 mb-4 font-mono text-sm min-h-[3.25rem]">
              {typed}
              <motion.span
                aria-hidden
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="inline-block w-[2px] h-4 bg-foreground ml-0.5 align-middle"
              />
            </div>
            <div className="space-y-2">
              {ROWS.map(([a, b], idx) => (
                <motion.div
                  key={a}
                  initial={{ opacity: 0, x: -20 }}
                  animate={showRows ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.4, delay: idx * 0.18, ease: 'easeOut' }}
                  className="flex items-center justify-between gap-4 rounded-lg border-2 border-foreground bg-neo-yellow/40 px-3 py-2 text-sm"
                >
                  <span className="font-bold">{a}</span>
                  <span className="text-muted-foreground">{b}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={showRows ? { opacity: 1 } : undefined}
                transition={{ delay: 0.7 }}
                className="text-xs text-muted-foreground pl-1 pt-1 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                17 more drafted - review before saving.
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistSection;
