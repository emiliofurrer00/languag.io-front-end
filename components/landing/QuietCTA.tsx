'use client';

import { motion } from 'framer-motion';
import { NeoButton } from '@/components/ui/NeoButton';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const QuietCTASection = () => {
  return (
    <section className="py-32 relative w-full">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            Pick something
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">worth remembering.</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-neo-magenta -z-0 -rotate-1" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Open source. No accounts required to try it. Take a look around.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/decks">
              <NeoButton variant="primary" size="lg">
                Browse decks
                <ArrowRight className="w-5 h-5" />
              </NeoButton>
            </Link>
            <Link href="/decks/editor/new">
              <NeoButton variant="secondary" size="lg">
                Make one
              </NeoButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuietCTASection;
