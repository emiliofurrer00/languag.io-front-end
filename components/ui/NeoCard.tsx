import { cn } from '@/lib/utils';
import * as React from 'react';

interface NeoCardProps extends React.ComponentPropsWithRef<'div'> {
  variant?: 'default' | 'magenta' | 'teal' | 'blue' | 'coral' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

function NeoCard({
  className,
  variant = 'default',
  size = 'md',
  children,
  ref,
  ...props
}: NeoCardProps) {
  const variants = {
    default: 'bg-card',
    magenta: 'bg-neo-magenta',
    teal: 'bg-neo-teal',
    blue: 'bg-neo-blue',
    coral: 'bg-neo-coral',
    yellow: 'bg-neo-yellow',
  };

  const sizes = {
    sm: 'rounded-xl border-[2px] shadow-[4px_4px_0_0_hsl(var(--foreground))]',
    md: 'rounded-2xl border-[3px] shadow-[6px_6px_0_0_hsl(var(--foreground))]',
    lg: 'rounded-3xl border-[3px] shadow-[8px_8px_0_0_hsl(var(--foreground))]',
  };

  return (
    <div
      ref={ref}
      className={cn('border-foreground p-6', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { NeoCard };
