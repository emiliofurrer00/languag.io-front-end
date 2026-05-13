'use client';

import { motion } from 'framer-motion';
import { NeoButton } from '@/components/ui/NeoButton';
import { ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import { revealViewport } from './motionViewport';

const QuietCTASection = () => {
  return (
    <section className="py-32 relative w-full">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
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
            No account required to preview a deck. Sign in when you are ready to save progress or
            build your own.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/decks">
              <NeoButton variant="primary" size="lg">
                Browse decks
                <ArrowRight className="w-5 h-5" />
              </NeoButton>
            </Link>
            <Link href="/sagas">
              <NeoButton variant="secondary" size="lg">
                Explore sagas
                <Compass className="w-5 h-5" />
              </NeoButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuietCTASection;
