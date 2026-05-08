import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AppStateTone = 'empty' | 'error' | 'loading' | 'success';

type AppStatePanelProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  kicker?: string;
  tone?: AppStateTone;
  children?: ReactNode;
  className?: string;
};

const toneStyles: Record<AppStateTone, string> = {
  empty: 'bg-primary',
  error: 'bg-neo-coral',
  loading: 'bg-secondary',
  success: 'bg-neo-teal',
};

export const stateActionClassName =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-[2px] border-foreground bg-secondary px-4 py-2 font-display text-sm font-semibold text-secondary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary/90 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export function AppStatePanel({
  icon: Icon,
  title,
  description,
  kicker,
  tone = 'empty',
  children,
  className,
}: AppStatePanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border-[3px] border-foreground bg-card p-6 text-center shadow-[7px_7px_0_0_hsl(var(--foreground))] sm:p-8',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-2 border-b-[2px] border-foreground bg-[repeating-linear-gradient(90deg,hsl(var(--foreground))_0_10px,transparent_10px_20px)] opacity-10"
      />
      <div
        className={cn(
          'mx-auto flex h-14 w-14 items-center justify-center rounded-xl border-[2px] border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]',
          toneStyles[tone]
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      {kicker ? (
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-2xl font-bold leading-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
