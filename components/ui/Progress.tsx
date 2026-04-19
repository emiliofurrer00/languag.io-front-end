import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;

function clampProgressValue(value: number | null | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function Progress({ className, value, ref, ...props }: ProgressProps) {
  const normalizedValue = clampProgressValue(value);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={normalizedValue}
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
