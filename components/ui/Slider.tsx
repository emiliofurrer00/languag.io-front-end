'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type SliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'type' | 'onChange'
> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
};

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    { className, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, ...props },
    ref
  ) => {
    const currentValue = value?.[0] ?? defaultValue?.[0] ?? Number(min);

    return (
      <div className={cn('flex w-full items-center', className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(event) => onValueChange?.([Number(event.target.value)])}
          className={cn(
            'h-2 w-full cursor-pointer appearance-none rounded-full border-2 border-foreground bg-secondary accent-primary',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
