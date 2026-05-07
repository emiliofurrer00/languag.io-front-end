'use client';

import { motion } from 'framer-motion';
import { NeoButton } from '@/components/ui/NeoButton';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="w-full min-h-[90vh] pt-32 pb-20 relative overflow-hidden">
      {/* Floating decorative shapes */}
      <motion.div
        className="absolute top-40 left-[8%] w-4 h-4 rounded-full bg-neo-magenta border-2 border-foreground"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-[12%] w-6 h-6 bg-neo-yellow border-2 border-foreground rotate-12"
        animate={{ y: [0, 18, 0], rotate: [12, -8, 12] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-32 left-[20%] w-3 h-3 rounded-full bg-neo-teal border-2 border-foreground"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border-2 border-foreground"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium text-sm">An open notebook for memory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight"
          >
            Make things{' '}
            <span className="relative inline-block">
              <span className="relative z-10">stick.</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
                className="absolute bottom-2 left-0 right-0 h-5 bg-neo-yellow -z-0 -rotate-1 origin-left"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A flashcard tool built around how memory actually works. Preview public decks, follow
            guided sagas, then sign in when you want saved progress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4 justify-center pt-2"
          >
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
          </motion.div>

          {/* Subtle scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-12"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-xs uppercase tracking-widest text-muted-foreground"
            >
              Scroll to see it in action
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
