import { ArrowRight } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import FlashCard from '../ui/Flashcard';

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 relative min-h-screen px-4 grid lg:grid-cols-2 gap-8 items-start w-full max-w-7xl mx-auto">
      <div>
        <div className="w-fit text-sm bg-neo-yellow px-4 py-2 rounded-full border-2 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))]">
          <span>Learn 3x faster with spaced repetition</span>
        </div>
        <div>
          <h1 className="mt-6 text-5xl lg:text-7xl font-bold leading-tight text-neutral-900 mb-6">
            Master anything with{' '}
            <span className="relative inline-block">
              <span className="absolute z-0 bg-neo-magenta h-4 w-full bottom-2"></span>
              <span className="z-10 relative">smart</span>
            </span>{' '}
            flashcards
          </h1>
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-lg px-1">
            Create, study, and remember. Our intelligent flashcard system adapts to how you learn,
            making memorization effortless and fun.
          </p>
          {/* Call to Action Buttons */}
          <div className="flex gap-2 flex-wrap mt-8">
            <NeoButton className="text-lg cursor-pointer bg-neo-yellow px-8 py-4 rounded-full font-semibold shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              Start Learning <ArrowRight className="inline-block w-5 h-5" />
            </NeoButton>
            <NeoButton className="text-lg cursor-pointer bg-neo-cream border-2 rounded-full px-8 py-4 font-semibold shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              Watch Demo
            </NeoButton>
          </div>
          {/* Student Count Section */}
          <div className="mt-8">
            <div className="gap-2 flex items-center py-2 bg-neo-cream">
              {/* User profile pics. Move to a separate component */}
              <div className="relative inline-flex">
                <div className="rounded-full bg-neo-blue w-10 h-10 border-2"></div>
                <div className="rounded-full bg-neo-magenta w-10 h-10 border-2 -ml-3"></div>
                <div className="rounded-full bg-neo-teal w-10 h-10 border-2 -ml-3"></div>
                <div className="rounded-full bg-neo-blue w-10 h-10 border-2 -ml-3"></div>
              </div>
              <span className="text-sm font-medium">
                <span className="font-bold">10,000+</span> students already learning
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Flashcard showcase Section */}
      <div className="px-1 flex justify-start items-center h-full">
        <FlashCard />
      </div>
    </section>
  );
}
