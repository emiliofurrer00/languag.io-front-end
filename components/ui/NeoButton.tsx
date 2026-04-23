import { cn } from '@/lib/utils';
import * as React from 'react';

interface NeoButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'dark' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

function NeoButton({
  className,
  variant = 'primary',
  size = 'md',
  children,
  type = 'button',
  ref,
  ...props
}: NeoButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-full border-[2px] border-foreground font-semibold transition-all font-display';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
    outline: 'bg-transparent text-foreground hover:bg-muted',
    dark: 'bg-foreground text-background hover:bg-foreground/90',
    success: 'bg-neo-teal text-foreground hover:bg-neo-teal/90',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        'shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { NeoButton };
