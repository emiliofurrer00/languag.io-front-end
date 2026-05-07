'use client';

import { motion } from 'framer-motion';
import { Brain, Calendar, TrendingUp } from 'lucide-react';

const moments = [
  {
    icon: Brain,
    label: 'You see it',
    body: 'A new card shows up. You read it, think for a second, reveal the answer.',
    color: 'bg-neo-magenta',
  },
  {
    icon: Calendar,
    label: 'You wait',
    body: 'Spaced repetition picks the next time you will see it - when you are about to forget.',
    color: 'bg-neo-teal',
  },
  {
    icon: TrendingUp,
    label: 'You remember',
    body: "Each successful recall pushes the interval out. Eventually it's just yours.",
    color: 'bg-neo-yellow',
  },
];

const StudyFlowSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            03 - The loop
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            How something
            <br />
            becomes <span className="italic">known.</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute left-[34px] top-8 bottom-8 w-1 bg-foreground origin-top hidden md:block"
          />

          <div className="space-y-6">
            {moments.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.18 }}
                className="flex items-start gap-6 p-6 rounded-2xl border-[3px] border-foreground bg-card shadow-[6px_6px_0_0_hsl(var(--foreground))] relative"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.18,
                    type: 'spring',
                    stiffness: 220,
                  }}
                  className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-xl border-2 border-foreground flex items-center justify-center ${m.color}`}
                >
                  <m.icon className="w-7 h-7" />
                </motion.div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    Step 0{i + 1}
                  </p>
                  <h3 className="font-display font-bold text-2xl mb-2">{m.label}</h3>
                  <p className="text-muted-foreground">{m.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyFlowSection;
