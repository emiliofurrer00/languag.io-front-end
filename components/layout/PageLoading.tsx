import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

type PageLoadingProps = {
  title: string;
  description: string;
  shell?: 'full' | 'app';
};

export default function PageLoading({ title, description, shell = 'full' }: PageLoadingProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-30 flex items-center justify-center bg-background px-4',
        shell === 'app' ? 'lg:px-[17rem]' : null
      )}
    >
      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-xl overflow-hidden rounded-2xl border-[3px] border-foreground bg-card shadow-[7px_7px_0_0_hsl(var(--foreground))]"
      >
        <div className="flex items-center justify-between border-b-[2px] border-foreground bg-secondary px-5 py-3">
          <span className="font-display text-sm font-bold">{title}</span>
          <LoaderCircle className="h-4 w-4 animate-spin" />
        </div>
        <div className="p-7">
          <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
          <div className="mt-6 h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-4 w-5/6 animate-pulse rounded-lg bg-muted" />
          <p className="mt-6 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
