import { Link, Sparkles } from 'lucide-react';
import { NeoButton } from '@/components/ui/NeoButton';
import { SignInButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary border-[2px] border-foreground flex items-center justify-center shadow-[3px_3px_0_0_hsl(var(--foreground))]">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl">Languag.io</span>
        </div>
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="font-medium hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="font-medium hover:text-primary transition-colors">
            Pricing
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <NeoButton variant="outline" size="sm" className="hidden sm:inline-flex cursor-pointer">
              Log In
            </NeoButton>
          </SignInButton>
          <NeoButton variant="primary" size="sm" className="cursor-pointer">
            Get Started
          </NeoButton>
        </div>
      </div>
    </nav>
  );
}
